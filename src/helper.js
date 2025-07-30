import axios from 'axios'
import OpenAI from "openai";


//UI DISPLAY
export const CATEGORIES = {
    AGE: [
      [4, "18–20 years"],
      [5, "21–24 years"],
      [6, "25–29 years"],
      [7, "30–34 years"],
      [8, "35–39 years"],
      [9, "40–44 years"],
      [10, "45–49 years"],
      [11, "50–54 years"],
      [12, "55–59 years"],
      [13, "60–64 years"],
      [14, "65 years and older"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    EDUC: [
      [1, "Special education"],
      [2, "0 to 8"],
      [3, "9 to 11"],
      [4, "12 (or GED)"],
      [5, "More than 12"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    ETHNIC: [
      [1, "Mexican"],
      [2, "Puerto Rican"],
      [3, "Other Hispanic or Latino origin"],
      [4, "Not of Hispanic or Latino origin"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    RACE: [
      [1, "American Indian/Alaska Native"],
      [2, "Asian"],
      [3, "Black or African American"],
      [4, "Native Hawaiian or Other Pacific Islander"],
      [5, "White"],
      [6, "Some other race alone/two or more races"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    GENDER: [
      [1, "Male"],
      [2, "Female"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    MH1: [
      [1, "Trauma- and stressor-related disorders"],
      [2, "Anxiety disorders"],
      [3, "Attention deficit/hyperactivity disorder (ADHD)"],
      [4, "Conduct disorders"],
      [5, "Delirium/dementia disorders"],
      [6, "Bipolar disorders"],
      [7, "Depressive disorders"],
      [8, "Oppositional defiant disorders"],
      [9, "Pervasive developmental disorders"],
      [10, "Personality disorders"],
      [11, "Schizophrenia or other psychotic disorders"],
      [12, "Alcohol or substance use disorders"],
      [13, "Other disorders/conditions"],
      [-9, "Missing/unknown/not collected/invalid/no or deferred diagnosis"]
    ],
    MH2: [
        [1, "Trauma- and stressor-related disorders"],
        [2, "Anxiety disorders"],
        [3, "Attention deficit/hyperactivity disorder (ADHD)"],
        [4, "Conduct disorders"],
        [5, "Delirium/dementia disorders"],
        [6, "Bipolar disorders"],
        [7, "Depressive disorders"],
        [8, "Oppositional defiant disorders"],
        [9, "Pervasive developmental disorders"],
        [10, "Personality disorders"],
        [11, "Schizophrenia or other psychotic disorders"],
        [12, "Alcohol or substance use disorders"],
        [13, "Other disorders/conditions"],
        [-9, "Missing/unknown/not collected/invalid/no or deferred diagnosis"]
      ],
      MH3: [
        [1, "Trauma- and stressor-related disorders"],
        [2, "Anxiety disorders"],
        [3, "Attention deficit/hyperactivity disorder (ADHD)"],
        [4, "Conduct disorders"],
        [5, "Delirium/dementia disorders"],
        [6, "Bipolar disorders"],
        [7, "Depressive disorders"],
        [8, "Oppositional defiant disorders"],
        [9, "Pervasive developmental disorders"],
        [10, "Personality disorders"],
        [11, "Schizophrenia or other psychotic disorders"],
        [12, "Alcohol or substance use disorders"],
        [13, "Other disorders/conditions"],
        [-9, "Missing/unknown/not collected/invalid/no or deferred diagnosis"]
      ],
    MARSTAT: [
      [1, "Never married"],
      [2, "Now married"],
      [3, "Separated"],
      [4, "Divorced, widowed"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    SAP: [
      [1, "Yes (Substance use disorder identified)"],
      [2, "No (No substance use disorder identified)"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    LIVARAG: [
      [1, "Experiencing Homelessness"],
      [2, "Private residence"],
      [3, "Other"],
      [-9, "Missing/unknown/not collected/invalid"]
    ],
    STATEFIP: [
        [1, "Alabama"],
        [2, "Alaska"],
        [4, "Arizona"],
        [5, "Arkansas"],
        [6, "California"],
        [8, "Colorado"],
        [9, "Connecticut"],
        [10, "Delaware"],
        [11, "District of Columbia"],
        [12, "Florida"],
        [13, "Georgia"],
        [15, "Hawaii"],
        [16, "Idaho"],
        [17, "Illinois"],
        [18, "Indiana"],
        [19, "Iowa"],
        [20, "Kansas"],
        [21, "Kentucky"],
        [22, "Louisiana"],
        [24, "Maryland"],
        [25, "Massachusetts"],
        [26, "Michigan"],
        [27, "Minnesota"],
        [28, "Mississippi"],
        [29, "Missouri"],
        [30, "Montana"],
        [31, "Nebraska"],
        [32, "Nevada"],
        [33, "New Hampshire"],
        [34, "New Jersey"],
        [35, "New Mexico"],
        [36, "New York"],
        [37, "North Carolina"],
        [38, "North Dakota"],
        [39, "Ohio"],
        [40, "Oklahoma"],
        [41, "Oregon"],
        [42, "Pennsylvania"],
        [44, "Rhode Island"],
        [45, "South Carolina"],
        [46, "South Dakota"],
        [47, "Tennessee"],
        [48, "Texas"],
        [49, "Utah"],
        [50, "Vermont"],
        [51, "Virginia"],
        [53, "Washington"],
        [54, "West Virginia"],
        [55, "Wisconsin"],
        [56, "Wyoming"],
        [72, "Puerto Rico"],
        [99, "Other jurisdictions"]
    ],
    DIVISION: [
        [0, "Other jurisdictions"],
        [1, "New England"],
        [2, "Middle Atlantic"],
        [3, "East North Central"],
        [4, "West North Central"],
        [5, "South Atlantic"],
        [6, "East South Central"],
        [7, "West South Central"],
        [8, "Mountain"],
        [9, "Pacific"]
    ],
    REGION: [
        [0, "Other jurisdictions"],
        [1, "Northeast"],
        [2, "Midwest"],
        [3, "South"],
        [4, "West"]
    ]
}

export const FIELDKEYMAP = {
    AGE: "age",
    EDUC: "education",
    ETHNIC: "ethnicity",
    RACE: "race",
    GENDER: "gender",
    MH1: "first mental health diagnosis (or suspicion)",
    MH2: "second mental health diagnosis (or suspicion)",
    MH3: "third mental health diagnosis (or suspicion)",
    MARSTAT: "marital status",
    SAP: "substance use disorder",
    LIVARAG: "living arrangement",
    STATEFIP: "state",
    DIVISION: "division",
    REGION: "region"
  };




//ROUTING
export const getDiagnosis = async() =>{
    try{
        const response = await axios.get('http://127.0.0.1:5000/')
        console.log(response)
        return response.data['patient_urgency']
    }
    catch(err){
        console.log(`there was a frontend error fetching data: ${err}`)
    }
}


export const getSeverity = async(client) =>{
  try{
    const postBody = {
      AGE: client['AGE'],
      EDUC: client['EDUC'],
      ETHNIC: client['ETHNIC'],
      RACE: client['RACE'],
      GENDER: client['GENDER'],
      MH1: client['MH1'],
      MH2: client['MH2'],
      MH3: client['MH3'],
      MARSTAT: client['MARSTAT'],
      SAP: client['SAP'],
      LIVARAG: client['LIVARAG'],
      STATEFIP: client['STATEFIP'],
      DIVISION: client['DIVISION'],
      REGION: client['REGION'],
    };
    const response = await axios.post('http://127.0.0.1:5000/severity', postBody)
    return response.data['patient_urgency']
    
  }
  catch(err){
    console.log(`there was a frontend error fetching data: ${err}`)
}
}

const LOADINGREMINDERS = [
  "Remember: Listen actively and validate the caller’s feelings.",
  "Keep an open mind — every caller’s experience is unique.",
  "Maintain a calm and empathetic tone, even during pauses.",
  "Note key words that might indicate risk or urgent needs.",
  "Use open-ended questions to encourage sharing.",
  "Stay aware of your own feelings and take a breath if needed.",
  "Check your surroundings for distractions — be fully present.",
  "Respect the caller’s pace — let them lead the conversation.",
  "Avoid assumptions; ask for clarification if unsure.",
  "Your support can make a huge difference — stay patient and kind."
];


export const fetchRandomReminder = () => {
  let randomIndex = Math.floor(Math.random() * LOADINGREMINDERS.length)
  return LOADINGREMINDERS[randomIndex]
}




export const SMISTEPS = [
  {
    title: "Stay Calm, Supportive, and Nonjudgmental",
    detail: "Use a calm voice, validate their feelings, and avoid pushing for too much detail too quickly."
  },
  {
    title: "Ensure Immediate Safety",
    detail: "Gently assess for suicidal ideation or intent. Ask things like: 'Are you feeling safe right now?' or 'Have you had any thoughts about harming yourself or others?'"
  },
  {
    title: "Stay Grounded in Reality",
    detail: "If the caller is disoriented, hallucinating, or paranoid, help them focus on their immediate environment with grounding questions."
  },
  {
    title: "Avoid Arguing with Delusions or Hallucinations",
    detail: "Don't try to convince them they’re wrong. Say things like: 'That must feel really real and scary for you.'"
  },
  {
    title: "Gently Suggest Professional Help",
    detail: "Frame support positively. Try: 'Have you talked to anyone about these feelings?' or 'You’re showing strength by reaching out.'"
  },
  {
    title: "Escalate to Supervisor or Clinical Lead",
    detail: "Flag the call for review if symptoms confirm what the model detected."
  },
  {
    title: "Log Key Symptoms Securely",
    detail: "Document only relevant phrases or patterns without using judgmental or clinical labels."
  },
  {
    title: "Provide Referrals if Caller is Open",
    detail: "Offer local crisis centers, mental health navigators, or outpatient services when appropriate."
  },
  {
    title: "Remember Your Role",
    detail: "You're not diagnosing. Let empathy guide you, and use the model as a tool — not an authority."
  }
];


export const NONSMISTEPS = [
  {
    title: "Don’t Assume Safety — Stay Engaged",
    detail: "Just because the model didn't detect severe symptoms doesn't mean the caller isn't struggling. Continue to actively listen."
  },
  {
    title: "Validate and Normalize",
    detail: "Use affirming language like, 'It’s completely okay to feel overwhelmed sometimes,' or 'You’re not alone in this.'"
  },
  {
    title: "Ask Follow-up Questions",
    detail: "Gently explore: 'How have you been sleeping?', 'What’s been stressing you out lately?', or 'How are you coping day to day?'"
  },
  {
    title: "Be Aware of Milder but Persistent Symptoms",
    detail: "Even if not severe, long-term anxiety, sadness, or isolation still deserve attention. Ask about how long it’s been going on."
  },
  {
    title: "Watch for Masking",
    detail: "Some callers may downplay symptoms. Listen closely for contradictions or hints they’re holding back."
  },
  {
    title: "Encourage Proactive Support",
    detail: "If they’re functioning but struggling, suggest early interventions like therapy, support groups, or lifestyle changes."
  },
  {
    title: "Flag Uncertainty for Review",
    detail: "If you're unsure, escalate for a second opinion or supervisory check. The model is helpful — but human insight matters."
  },
  {
    title: "Avoid Clinical Labels",
    detail: "Focus on what the person is experiencing, not whether they 'qualify' for a condition. Meet them where they are."
  },
  {
    title: "Close with Compassion",
    detail: "Even if the caller sounds stable, end with warmth and options: 'If things ever feel heavier, we’re always here.'"
  }
];





//ROUTING: API 

export const fetchSymptomExtraction = async (prompt) =>{
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_KEY,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          "role": "system",
          "content": [
            {
              "type": "input_text",
              "text": "You are a statistical model that outputs the most likely illness that a patient (a 988 hotline caller) is experiencing. Your job is to extract the keywords the user says of highest significance (at most 3 phrases/words) and to provide one or two illnesses the user may be facing. These are the illnesses you can choose from and these alone. \n    1: \"Trauma- and stressor-related disorders\",\n    2: \"Anxiety disorders\",\n    3: \"Attention deficit/hyperactivity disorder (ADHD)\",\n    4: \"Conduct disorders\",\n    5: \"Delirium/dementia disorders\",\n    6: \"Bipolar disorders\",\n    7: \"Depressive disorders\",\n    8: \"Oppositional defiant disorders\",\n    9: \"Pervasive developmental disorders\",\n    10: \"Personality disorders\",\n    11: \"Schizophrenia or other psychotic disorders\",\n    12: \"Alcohol or substance use disorders\",\n    13: \"Other disorders/conditions\",\n    -9: \"Missing/unknown/not collected/invalid/no or deferred diagnosis\"\n\nYou will return a simple json object which goes as follows:\n\n{\nkeywords: [\"sample1\", \"this is sample2\", \"sample3\"],\nillness: [\"picked illness\"]\n}"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Hey... I’ve been getting these weird tight feelings in my chest, and my hands get all sweaty — I think it’s anxiety, but it feels like something worse.\n\nI try to calm myself down, but then I panic about panicking, and it just gets worse.\n\nSometimes I feel like I’m going crazy. I know that sounds dramatic... but I don’t feel in control anymore.\n\nI used to be able to hide it, but now even little things are triggering me. Like missing a text reply or getting a weird tone from someone."
            }
          ]
        },
        {
          "role": "assistant",
          "content": [
            {
              "type": "output_text",
              "text": "{keywords: [\"panic about panicking\", \"hands get all sweaty\", \"don’t feel in control\"], illness: [\"Anxiety disorders\"]}"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "\"Hey, uh... I’m not really sure why I called. I guess I just needed someone to talk to.\nLately, things have been... off. Like, I keep hearing someone say my name when no one’s around. It’s probably nothing, but it keeps happening.\nAnd sometimes I feel like people are watching me when I’m walking around. Like, I know it’s irrational, but I still look over my shoulder.\nI haven’t really told anyone because I’m scared they’ll think I’m crazy or something. But it’s starting to mess with my sleep. I just don’t feel like myself.\""
            }
          ]
        },
        {
          "role": "assistant",
          "content": [
            {
              "type": "output_text",
              "text": "{keywords: [\"people are watching me\", \"they’ll think I’m crazy\", \"know it’s irrational\"], illness:[\"Schizophrenia or other psychotic disorders]}"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "\"Hi… I don’t really know what to say. Everything just feels really heavy lately.\nI wake up and I’m already exhausted, like there’s no point in even getting out of bed.\nThings I used to care about—I just don’t anymore. I haven’t seen friends in weeks, and honestly, I don’t even return texts anymore.\nIt’s like I’m stuck in this fog and nothing I do makes it go away.\nSometimes I wonder if people would even notice if I disappeared.\nI’m not saying I’d do anything, but… the thought crosses my mind more than it should.\""
            }
          ]
        },
        {
          "id": "msg_6888f0fbb6e881a1b939eaff3692e04500db537a5a2a8690",
          "role": "assistant",
          "content": [
            {
              "type": "output_text",
              "text": "{keywords: [\"feels really heavy\", \"no point in even getting out of bed\", \"stuck in this fog\"], illness: [\"Depressive disorders\"]}"
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "\"I don’t really talk about what happened, but it’s been affecting me a lot more than I thought it would.\nCertain sounds or smells just send me right back to that day—like I’m reliving it all over again.\nI can’t sleep. I keep having the same nightmare. And when I’m awake, I feel on edge all the time, like something bad is about to happen.\nI avoid going to certain places, even seeing certain people, because it all reminds me of it.\nEveryone keeps saying I should be over it by now, but I’m not. I don’t know if I’ll ever be.\""
            }
          ]
        },
        {
          "id": "msg_6888f122a30c81a1a23ea9f7a3c63ee900db537a5a2a8690",
          "role": "assistant",
          "content": [
            {
              "type": "output_text",
              "text": "{keywords: [\"reliving it all over again\", \"keep having the same nightmare\", \"avoid going to certain places\"], illness: [\"Trauma- and stressor-related disorders\"]}"
            }
          ]
        },
        {
          "role":"user",
          "content":[
            {
              "type":"input_text",
              "text":prompt
            }
          ]
        }

      ],
      text: {
        "format": {
          "type": "text"
        }
      },
      reasoning: {},
      tools: [],
      temperature: 1,
      max_output_tokens: 2048,
      top_p: 1,
      store: true
    });

    // Suppose response.output_text is the raw string without quotes on keys
    let rawStr = response.output_text;

    // Fix by quoting keys:
    let fixedStr = rawStr.replace(/(\w+):/g, '"$1":');

    // Now parse safely
    const obj = JSON.parse(fixedStr);

    console.log(obj)

    return obj

  
    //console.log(JSON.parse(response.output_text))

}