import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { matchmaker: {}, customers: [], notes: [], meetings: [], sentMatches: [] };
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Initialize OpenAI client if API key is present
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('OpenAI API initialized.');
} else {
  console.log('No OpenAI API key found. Using mock AI response engine.');
}

// COMPATIBILITY LOGIC
function calculateCompatibility(c1, c2) {
  // 1. Life Goals (30%)
  let lifeGoalsScore = 0;
  let totalLifeGoalsFields = 3;
  let lifeGoalsMatches = 0;
  
  if (c1.lifeGoals && c2.lifeGoals) {
    if (c1.lifeGoals.wantKids === c2.lifeGoals.wantKids) {
      lifeGoalsMatches += 1;
    } else if (c1.lifeGoals.wantKids === 'Maybe' || c2.lifeGoals.wantKids === 'Maybe') {
      lifeGoalsMatches += 0.5;
    }
    
    if (c1.lifeGoals.marriageTimeline === c2.lifeGoals.marriageTimeline) {
      lifeGoalsMatches += 1;
    } else {
      lifeGoalsMatches += 0.5; // partial match
    }
    
    if (c1.lifeGoals.familyValues === c2.lifeGoals.familyValues) {
      lifeGoalsMatches += 1;
    } else {
      lifeGoalsMatches += 0.5;
    }
    lifeGoalsScore = (lifeGoalsMatches / totalLifeGoalsFields) * 100;
  }

  // 2. Lifestyle Compatibility (20%)
  let lifestyleScore = 0;
  let lifestyleMatches = 0;
  const lifestyleFields = ['smoking', 'drinking', 'fitness', 'travel', 'socialLife'];
  if (c1.lifestyle && c2.lifestyle) {
    lifestyleFields.forEach(field => {
      if (c1.lifestyle[field] === c2.lifestyle[field]) {
        lifestyleMatches += 1;
      } else if (field === 'drinking' && (c1.lifestyle[field] === 'Socially' || c2.lifestyle[field] === 'Socially')) {
        lifestyleMatches += 0.5;
      }
    });
    // Pets comparison
    if (c1.lifestyle.pets === c2.lifestyle.pets) {
      lifestyleMatches += 1;
    } else if (c1.lifestyle.pets === 'None' || c2.lifestyle.pets === 'None') {
      lifestyleMatches += 0.5;
    }
    lifestyleScore = (lifestyleMatches / 6) * 100;
  }

  // 3. Location Compatibility (15%)
  let locationScore = 0;
  if (c1.city && c2.city) {
    if (c1.city === c2.city) {
      locationScore = 100;
    } else {
      const c1Open = c1.locationPreferences?.relocation === 'Open to Relocate';
      const c2Open = c2.locationPreferences?.relocation === 'Open to Relocate';
      if (c1Open && c2Open) {
        locationScore = 80;
      } else if (c1Open || c2Open) {
        locationScore = 60;
      } else {
        locationScore = 20; // Relocation conflicts
      }
    }
  }

  // 4. Personality & Values (15%)
  let personalityScore = 0;
  let personalityMatches = 0;
  if (c1.personality && c2.personality) {
    if (c1.personality.social === c2.personality.social) {
      personalityMatches += 1;
    } else if (c1.personality.social === 'Ambivert' || c2.personality.social === 'Ambivert') {
      personalityMatches += 0.7; // Partial match with ambiverts
    }
    if (c1.personality.valuesStyle === c2.personality.valuesStyle) {
      personalityMatches += 1;
    } else if (c1.personality.valuesStyle === 'Moderate' || c2.personality.valuesStyle === 'Moderate') {
      personalityMatches += 0.6;
    }
    if (c1.personality.orientation === c2.personality.orientation) {
      personalityMatches += 1;
    } else if (c1.personality.orientation === 'Balanced' || c2.personality.orientation === 'Balanced') {
      personalityMatches += 0.6;
    }
    personalityScore = (personalityMatches / 3) * 100;
  }

  // 5. Career & Education Compatibility (10%)
  let careerScore = 0;
  let careerMatches = 0;
  if (c1.careerEducation && c2.careerEducation) {
    if (c1.careerEducation.educationLevel === c2.careerEducation.educationLevel) careerMatches += 1;
    else careerMatches += 0.6;
    
    if (c1.careerEducation.professionalAmbition === c2.careerEducation.professionalAmbition) careerMatches += 1;
    else careerMatches += 0.5;
    
    if (c1.careerEducation.mindset === c2.careerEducation.mindset) careerMatches += 1;
    
    if (c1.careerEducation.industry === c2.careerEducation.industry) careerMatches += 1;
    else careerMatches += 0.5; // partial for general professional overlap
    
    careerScore = (careerMatches / 4) * 100;
  }

  // 6. Shared Interests (10%)
  let interestsScore = 0;
  if (c1.interests && c2.interests) {
    const i1 = c1.interests.map(i => i.toLowerCase());
    const i2 = c2.interests.map(i => i.toLowerCase());
    const intersection = i1.filter(i => i2.includes(i));
    const union = Array.from(new Set([...i1, ...i2]));
    interestsScore = union.length > 0 ? (intersection.length / union.length) * 100 : 0;
  }

  // Dealbreaker Warnings
  const concerns = [];
  if (c1.lifeGoals?.wantKids !== c2.lifeGoals?.wantKids) {
    if ((c1.lifeGoals?.wantKids === 'Yes' && c2.lifeGoals?.wantKids === 'No') || 
        (c1.lifeGoals?.wantKids === 'No' && c2.lifeGoals?.wantKids === 'Yes')) {
      concerns.push("Different views on children (one wants children, one does not).");
    }
  }
  
  if (c1.city !== c2.city && 
      c1.locationPreferences?.relocation === 'Not Open to Relocate' && 
      c2.locationPreferences?.relocation === 'Not Open to Relocate') {
    concerns.push("Relocation mismatch: Both profiles are unwilling to relocate to a different city.");
  }
  
  if ((c1.lifestyle?.smoking === 'Yes' && c2.lifestyle?.smoking === 'No') || 
      (c1.lifestyle?.smoking === 'No' && c2.lifestyle?.smoking === 'Yes')) {
    concerns.push("Smoking preference mismatch: One profile smoking habits mismatch with partner expectations.");
  }
  
  if (c1.lifestyle?.drinking === 'No' && c2.lifestyle?.drinking === 'Yes') {
    // Soft lifestyle warning
    concerns.push("Lifestyle difference: One profile is a non-drinker while the other drinks regularly.");
  }

  const overallScore = Math.round(
    (lifeGoalsScore * 0.30) +
    (lifestyleScore * 0.20) +
    (locationScore * 0.15) +
    (personalityScore * 0.15) +
    (careerScore * 0.10) +
    (interestsScore * 0.10)
  );

  return {
    overallScore,
    breakdown: {
      lifeGoals: Math.round(lifeGoalsScore),
      lifestyle: Math.round(lifestyleScore),
      location: Math.round(locationScore),
      personality: Math.round(personalityScore),
      career: Math.round(careerScore),
      interests: Math.round(interestsScore)
    },
    concerns
  };
}

// Generate local fallback mock AI explanations
function generateLocalAIExplanation(c1, c2, comp) {
  const commonInterests = c1.interests.filter(i => c2.interests.includes(i));
  let interestText = commonInterests.length > 0 
    ? `They share deep interests in ${commonInterests.slice(0, 3).join(', ')}.` 
    : `They have complementary hobbies and activities.`;

  let explanation = `${c1.name} and ${c2.name} show a strong ${comp.overallScore}% compatibility index. `;
  
  if (comp.overallScore >= 90) {
    explanation += `They align exceptionally well on major life goals (wanting kids: ${c1.lifeGoals?.wantKids}), family structures, and locations. Both operate in highly ambitious professional settings (${c1.careerEducation?.industry} and ${c2.careerEducation?.industry}) which makes for an equal and understanding career partnership. ${interestText}`;
  } else if (comp.overallScore >= 80) {
    explanation += `They share a solid foundation of matching values and lifestyle habits. They both maintain a ${c1.lifestyle?.fitness} fitness schedule and similar drinking habits. While they reside in ${c1.city} and ${c2.city}, their relocation flexibility ensures location won't be a dealbreaker. ${interestText}`;
  } else {
    explanation += `There is moderate compatibility here. While they share mutual interests, there are some differences in daily lifestyle habits and location preferences. They share positive communication expectations, but would need to discuss relocation or lifestyle adjustments.`;
  }
  
  if (comp.concerns.length > 0) {
    explanation += ` Note: Matchmakers should review the potential concerns regarding ${comp.concerns.map(c => c.split(':')[0]).join(', ')} before introducing.`;
  }
  
  return explanation;
}

function generateLocalAIIntro(c1, c2) {
  return `Hi ${c2.name},\n\nI hope you are doing well! I have a wonderful profile that I think you would connect with beautifully. Meet ${c1.name}, a ${c1.age}-year-old ${c1.occupation} based in ${c1.city}. He is a graduate of ${c1.education.split('from ')[1] || c1.education}.\n\nWhat stood out to me was your shared interest in ${c1.interests.slice(0, 2).join(' and ')}. He values family deeply and maintains a ${c1.personality?.social.toLowerCase()} social personality, just like you. Let me know if you would like me to share his full profile and schedule a brief introduction call!`;
}

// API ENDPOINTS

// 1. Get dashboard stats
app.get('/api/dashboard-stats', (req, res) => {
  const db = readDB();
  const totalCustomers = db.customers.length;
  const activeJourneys = db.customers.filter(c => c.journeyStatus !== 'Profile Verification' && c.journeyStatus !== 'Relationship Building').length;
  const matchesSent = db.sentMatches.length;
  const meetingsScheduled = db.meetings.filter(m => m.status === 'Scheduled').length;
  
  res.json({
    totalCustomers,
    activeJourneys,
    matchesSent,
    meetingsScheduled,
    profilesVerified: db.customers.filter(c => c.journeyStatus !== 'Profile Verification').length
  });
});

// 2. Get all customers
app.get('/api/customers', (req, res) => {
  const db = readDB();
  res.json(db.customers);
});

// 3. Get single customer details
app.get('/api/customers/:id', (req, res) => {
  const db = readDB();
  const customer = db.customers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

// 4. Create new customer
app.post('/api/customers', (req, res) => {
  const db = readDB();
  const newCustomer = {
    id: `TDC${1254 + db.customers.length}`,
    journeyStatus: 'Profile Verification',
    lastActivity: 'Just now',
    ...req.body
  };
  
  db.customers.push(newCustomer);
  writeDB(db);
  res.status(201).json(newCustomer);
});

// 5. Update customer profile
app.put('/api/customers/:id', (req, res) => {
  const db = readDB();
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  
  db.customers[index] = {
    ...db.customers[index],
    ...req.body,
    lastActivity: 'Just now'
  };
  
  writeDB(db);
  res.json(db.customers[index]);
});

// 6. Get compatibility metrics and AI details
app.post('/api/compatibility', async (req, res) => {
  const { c1Id, c2Id } = req.body;
  const db = readDB();
  const c1 = db.customers.find(c => c.id === c1Id);
  const c2 = db.customers.find(c => c.id === c2Id);
  
  if (!c1 || !c2) {
    return res.status(404).json({ error: 'Profiles not found' });
  }
  
  const comp = calculateCompatibility(c1, c2);
  
  // Try calling OpenAI if configured
  if (openai) {
    try {
      const explanationPrompt = `You are an AI Matchmaker for "The Date Crew", a psychology-based matchmaking firm.
Analyze these two profiles:
Profile 1: ${JSON.stringify(c1)}
Profile 2: ${JSON.stringify(c2)}
Their compatibility breakdown: ${JSON.stringify(comp)}
Write a concise, professional, human-centric explanation (3-4 sentences) outlining why they align, why they have a ${comp.overallScore}% score, and what common grounds they have. Keep it warm, psychology-focused, and suitable for a professional matchmaker's CRM.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: explanationPrompt }],
        max_tokens: 200,
        temperature: 0.7
      });
      
      const explanation = response.choices[0].message.content.trim();
      return res.json({ ...comp, aiExplanation: explanation });
    } catch (err) {
      console.error('OpenAI call failed, falling back to local engine:', err);
    }
  }
  
  // Fallback
  const aiExplanation = generateLocalAIExplanation(c1, c2, comp);
  res.json({ ...comp, aiExplanation });
});

// 7. Get or add notes
app.get('/api/customers/:id/notes', (req, res) => {
  const db = readDB();
  const notes = db.notes.filter(n => n.customerId === req.params.id);
  res.json(notes);
});

app.post('/api/customers/:id/notes', (req, res) => {
  const db = readDB();
  const newNote = {
    id: `n${db.notes.length + 1}`,
    customerId: req.params.id,
    date: new Date().toISOString(),
    content: req.body.content
  };
  
  db.notes.unshift(newNote); // newest first
  
  // Also update customer last activity
  const custIndex = db.customers.findIndex(c => c.id === req.params.id);
  if (custIndex !== -1) {
    db.customers[custIndex].lastActivity = 'Just now';
  }
  
  writeDB(db);
  res.status(201).json(newNote);
});

// 8. Get meetings
app.get('/api/meetings', (req, res) => {
  const db = readDB();
  res.json(db.meetings);
});

app.post('/api/meetings', (req, res) => {
  const db = readDB();
  const newMeeting = {
    id: `m${db.meetings.length + 1}`,
    status: 'Scheduled',
    ...req.body
  };
  db.meetings.unshift(newMeeting);
  writeDB(db);
  res.status(201).json(newMeeting);
});

// 9. Send match workflow
app.post('/api/send-match', async (req, res) => {
  const { senderId, receiverId } = req.body;
  const db = readDB();
  
  const c1 = db.customers.find(c => c.id === senderId);
  const c2 = db.customers.find(c => c.id === receiverId);
  
  if (!c1 || !c2) {
    return res.status(404).json({ error: 'Profiles not found' });
  }

  // Generate Intro message via OpenAI if key is present
  let introMessage = '';
  if (openai) {
    try {
      const introPrompt = `You are a professional matchmaker draft-writer for "The Date Crew". 
Compose a personalized, warm, human-centric introduction message sent to ${c2.name} explaining why ${c1.name} is a great match for them.
Highlight their shared interests, values, and location synergy. Mention his age (${c1.age}), career (${c1.occupation}), and education background (${c1.education}).
Make it feel custom, tailored, and write it in first person as the matchmaker. Keep it to 2 small paragraphs.`;
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: introPrompt }],
        max_tokens: 250,
        temperature: 0.7
      });
      introMessage = response.choices[0].message.content.trim();
    } catch (err) {
      console.error('OpenAI intro message call failed:', err);
    }
  }
  
  if (!introMessage) {
    introMessage = generateLocalAIIntro(c1, c2);
  }

  // Update customer status to Match Sent
  const c1Idx = db.customers.findIndex(c => c.id === senderId);
  if (c1Idx !== -1) {
    db.customers[c1Idx].journeyStatus = 'Match Sent';
    db.customers[c1Idx].lastActivity = 'Just now';
  }

  // Log to sent matches list
  const newSentMatch = {
    id: `s${db.sentMatches.length + 1}`,
    senderId,
    receiverId,
    date: new Date().toISOString(),
    status: 'Sent',
    introMessage
  };
  db.sentMatches.unshift(newSentMatch);

  // Add system note
  const systemNote = {
    id: `n${db.notes.length + 1}`,
    customerId: senderId,
    date: new Date().toISOString(),
    content: `System Log: Match suggestion sent to ${c2.name}. AI-generated intro message created.`
  };
  db.notes.unshift(systemNote);

  writeDB(db);
  res.json({ success: true, sentMatch: newSentMatch });
});

// Serve frontend in production (optional, good practice)
if (process.env.NODE_ENV === 'production') {
  let distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    distPath = path.join(__dirname, '..', 'frontend', 'dist');
  }
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Catch-all middleware for frontend routing
    app.use((req, res) => {
      // If an API request reaches here, it means it didn't match any valid API route
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('TDC Matchmaker Dashboard: Frontend is building or index.html is missing. Please reload in a moment!');
      }
    });
  } else {
    app.use((req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.status(200).send('TDC Matchmaker Dashboard: Backend is running. Frontend build folder (dist) not found.');
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
