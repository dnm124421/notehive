/**
 * NoteHive Seed Data & Data Model Schemas
 */

window.SEED_DATA = {
  currentUser: {
    id: "user_me",
    name: "Riot_Grrl",
    email: "riot@hive.edu",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARTa22du4fYi27s_Vkt69UInhvij7lPi5jhxYUFhVa8vktN4aJqgF-OjgWyU4W_-mxG0knPGY2eIfo596BhPh92KgAo3FYvSHFe_8zW0LDvkUbMPl80pqCFkCIwCu3jBoyg4blxNDK--kyCBpEzx7mpjRroD8BXyZ7EIqjiVQlt_gVWwJj9ZAnSZDHNjZDZ7OnBCr6uK3h4frU21FfYhpfH1dxbTWexqa3kWEKvP4Bn0wB32DA0bLx",
    department: "Data Science",
    role: "Admin", // Admin or Member
    points: 21500,
    badges: ["Data Preprocessing Expert", "Code Ninja", "Top Contributor", "Bug Hunter"],
    joinedGroupIds: ["grp_ds", "grp_cs", "grp_hackathon"],
    mutedSubjectIds: [],
    savedOfflineNoteIds: ["note_1"]
  },

  users: [
    {
      id: "user_me",
      name: "Riot_Grrl",
      email: "riot@hive.edu",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARTa22du4fYi27s_Vkt69UInhvij7lPi5jhxYUFhVa8vktN4aJqgF-OjgWyU4W_-mxG0knPGY2eIfo596BhPh92KgAo3FYvSHFe_8zW0LDvkUbMPl80pqCFkCIwCu3jBoyg4blxNDK--kyCBpEzx7mpjRroD8BXyZ7EIqjiVQlt_gVWwJj9ZAnSZDHNjZDZ7OnBCr6uK3h4frU21FfYhpfH1dxbTWexqa3kWEKvP4Bn0wB32DA0bLx",
      department: "Data Science",
      points: 21500,
      badges: ["Data Preprocessing Expert", "Code Ninja", "Top Contributor"]
    },
    {
      id: "user_zane",
      name: "Zane.X",
      email: "zane@hive.edu",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARo7NRwfX-W2Rp6vXmShKvuX2Mi2Ma5aQ0nkuZDhJoiI_DM0FITQO50WltQJjwlnQe2jRnd2C6NYBNdLCbOFcsqVql9T_4iJs8uOmcoSJsRbo7EaSa0BplOTw7TBcTLOg-4pLuYxje29NB5_aRkWH7bgxcF5PCiH-zN5OpUfn1K4qKJHWen6mZGlyD9lxzofKy8EcZy-5bkcvwoToSwkUAzmLofY2efb1bH9tV9JauvNlCHu0WqWSN",
      department: "Data Science",
      points: 14200,
      badges: ["Stats Guru", "Active Peer"]
    },
    {
      id: "user_echo",
      name: "Echo.V",
      email: "echo@hive.edu",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdig4FH8lGfSQ5mDy8igJMrwVOwawMl5pNW3lQmRiObN8K1qtzy918CNOOpF6fodQgbFkNhhzaxkAsTjb-52mctOlqk9vPlIug3h-zK1wAJornlHFNhZNsxsA5A-fQszSqfvnwuHf4K3J72MFkgdW6-1mZEJGYzERXa4NQ3Nw3V5tLnYFDvgYsApLSl21HrltZxv7dUajhZWraB6ZesWFzQB844nJiYpa0n-1rYSaMrT7z_jhp94ev",
      department: "Data Science",
      points: 11800,
      badges: ["Curator", "Note Legend"]
    },
    {
      id: "user_neon",
      name: "Neon_Nomad",
      email: "neon@hive.edu",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwDsQpTwoDl5-A0B9RiptHUSXRx7qtyoCt_pBQwHDuohkI3s50pbefToC3SBLNraNMQyh9NOlLBm3y7KahA2VXl_h1ZZ3wsekmd1UV4S-8vxnzc4UFKVilxdsazi2MivuBGsunlib5f86gGs-UR1gikCu5Uor_OKQFwKxO3ypBWqctiqSsmyX902Lgl6YlKOcAGp3bXn_UBaRZf6tiKBgQ30INux3C_pJDU1ZlawYzBXazOhOHTIy",
      department: "Data Science",
      points: 9400,
      badges: ["ML Pioneer"]
    },
    {
      id: "user_ghost",
      name: "INK_GHOST",
      email: "ghost@hive.edu",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvehNyniE3-qJN773z2O6gL0807QA_OdbXNL15dAA_nr1T5EawWd9-bI5YOJVLjsQTufQCfxkeaQnictKITqzGncbfWtkYi2faUIKDlEgALBzGNyNsuMHnl205jeSphnNvAcrM3iIfT6Y3_Fu35uyAKs-xdnkQXY7y7wXMXm2KkllBfAq5JGPgZff0b7KRDYYzgDj9-gPMkxWLBKiyXk9qyaRsPT3p0AfLE37K8G5BByuEtiYwc_7b",
      department: "Computer Science",
      points: 8100,
      badges: ["Security Champ"]
    }
  ],

  groups: [
    {
      id: "grp_ds",
      name: "Data Science Dept",
      type: "department",
      description: "Official group for Data Science undergrads & postgrads. Core modules, exam prep, & real-time study notes.",
      memberCount: 248,
      adminIds: ["user_me"],
      memberIds: ["user_me", "user_zane", "user_echo", "user_neon"],
      inviteLinkToken: "ds-dept-2026-secret",
      whatsappInviteLink: "https://chat.whatsapp.com/DS_Dept_Companion_Group_Invite",
      subjectIds: ["sbj_dp", "sbj_ml", "sbj_stats", "sbj_dl", "sbj_bigdata", "sbj_nlp", "sbj_cv", "sbj_db", "sbj_python", "sbj_ai_ethics", "sbj_linear_alg"]
    },
    {
      id: "grp_cs",
      name: "Computer Science Dept",
      type: "department",
      description: "Algorithms, OS, Computer Networks, and System Architecture study hub.",
      memberCount: 312,
      adminIds: ["user_ghost"],
      memberIds: ["user_me", "user_ghost"],
      inviteLinkToken: "cs-dept-2026-token",
      whatsappInviteLink: "https://chat.whatsapp.com/CS_Dept_Group_Invite",
      subjectIds: ["sbj_algo", "sbj_os", "sbj_networks"]
    },
    {
      id: "grp_hackathon",
      name: "AI Hackathon Squad 2026",
      type: "custom",
      description: "Private project team building LLM & RAG notes-agent for NoteHive competition.",
      memberCount: 5,
      adminIds: ["user_me"],
      memberIds: ["user_me", "user_zane"],
      inviteLinkToken: "hackathon-ai-squad",
      whatsappInviteLink: "https://chat.whatsapp.com/Hackathon_Squad_Chat",
      subjectIds: ["sbj_hack_notes"]
    },
    {
      id: "grp_ee",
      name: "Electrical Engineering Dept",
      type: "department",
      description: "Circuit analysis, embedded systems, microcontrollers, and DSP notes.",
      memberCount: 180,
      adminIds: ["user_zane"],
      memberIds: ["user_zane"],
      inviteLinkToken: "ee-dept-pass",
      whatsappInviteLink: "https://chat.whatsapp.com/EE_Dept_Group_Invite",
      subjectIds: ["sbj_circuits"]
    }
  ],

  subjects: [
    {
      id: "sbj_dp",
      groupId: "grp_ds",
      name: "Data Preprocessing",
      icon: "analytics",
      lessonsCount: 8,
      quizzesCount: 3,
      progressPercent: 75,
      hasNewActivity: true,
      pendingAssignment: true,
      examDate: "2026-08-15T09:00:00Z",
      tags: ["#unit3", "#important", "#exam-2026", "#imputation", "#scaling"]
    },
    {
      id: "sbj_ml",
      groupId: "grp_ds",
      name: "Machine Learning",
      icon: "precision_manufacturing",
      lessonsCount: 12,
      quizzesCount: 4,
      progressPercent: 45,
      hasNewActivity: true,
      pendingAssignment: true,
      examDate: "2026-08-20T14:00:00Z",
      tags: ["#regression", "#classification", "#xgboost", "#metrics"]
    },
    {
      id: "sbj_stats",
      groupId: "grp_ds",
      name: "Applied Statistics",
      icon: "query_stats",
      lessonsCount: 10,
      quizzesCount: 5,
      progressPercent: 90,
      hasNewActivity: false,
      pendingAssignment: false,
      examDate: "2026-08-10T10:00:00Z",
      tags: ["#hypothesis", "#bayes", "#probability"]
    },
    {
      id: "sbj_dl",
      groupId: "grp_ds",
      name: "Deep Learning",
      icon: "psychology",
      lessonsCount: 6,
      quizzesCount: 2,
      progressPercent: 20,
      hasNewActivity: false,
      pendingAssignment: false,
      examDate: "2026-09-01T09:00:00Z",
      tags: ["#cnn", "#rnn", "#transformers", "#backprop"]
    },
    {
      id: "sbj_bigdata",
      groupId: "grp_ds",
      name: "Big Data Systems",
      icon: "dataset",
      lessonsCount: 5,
      quizzesCount: 1,
      progressPercent: 10,
      hasNewActivity: false,
      pendingAssignment: false,
      examDate: null,
      tags: ["#spark", "#hadoop", "#pyspark"]
    },
    {
      id: "sbj_algo",
      groupId: "grp_cs",
      name: "Design & Analysis of Algorithms",
      icon: "code",
      lessonsCount: 14,
      quizzesCount: 6,
      progressPercent: 60,
      hasNewActivity: true,
      pendingAssignment: false,
      examDate: "2026-08-18T10:00:00Z",
      tags: ["#dp", "#graphs", "#sorting"]
    }
  ],

  content: [
    // Data Preprocessing - Notes Tab
    {
      id: "note_1",
      subjectId: "sbj_dp",
      tab: "notes",
      type: "note",
      title: "The Missing Values Manifesto",
      body: "Stop dropping rows immediately! Dropping rows introduces bias and destroys dataset variance.\n\n### Core Imputation Rules:\n1. **Numerical Data**: Use Median when outliers are present; Mean only if normally distributed.\n2. **Categorical Data**: Mode imputation or create an explicit 'Unknown' category.\n3. **K-NN & MICE Imputation**: Recommended for complex feature inter-dependencies.\n\n```python\nfrom sklearn.impute import KNNImputer\nimputer = KNNImputer(n_neighbors=5)\nX_imputed = imputer.fit_transform(X)\n```\n\nCheck Unit 3 lecture slides for mathematical proof.",
      fileUrl: null,
      externalUrl: null,
      tags: ["#important", "#imputation", "#unit3"],
      authorId: "user_me",
      authorName: "Riot_Grrl",
      upvotes: 1240,
      downvotes: 12,
      score: 1228,
      pointsReward: 450,
      categoryLabel: "Essential",
      versionHistory: [
        {
          editedAt: "2026-08-01T14:20:00Z",
          editedBy: "Riot_Grrl",
          summary: "Added KNNImputer python code snippet and MICE guidance."
        },
        {
          editedAt: "2026-07-28T10:00:00Z",
          editedBy: "Riot_Grrl",
          summary: "Initial draft creation with basic Mean/Median rules."
        }
      ],
      createdAt: "2026-07-28T10:00:00Z",
      updatedAt: "2026-08-01T14:20:00Z"
    },
    {
      id: "note_2",
      subjectId: "sbj_dp",
      tab: "notes",
      type: "note",
      title: "Scaling & Normalization Blueprint",
      body: "Min-Max Scaler vs Standard Scaler vs Robust Scaler.\n\n- **StandardScaler**: Centers data around mean 0 with standard deviation 1. Required for SVM, PCA, and Logistic Regression.\n- **MinMaxScaler**: Scales data strictly between [0, 1]. Preserves zero values in sparse matrices.\n- **RobustScaler**: Uses Median & IQR. Essential if your dataset has extreme outliers!",
      tags: ["#scaling", "#unit3", "#exam-2026"],
      authorId: "user_zane",
      authorName: "Zane.X",
      upvotes: 985,
      downvotes: 5,
      score: 980,
      pointsReward: 320,
      categoryLabel: "Deep Dive",
      versionHistory: [],
      createdAt: "2026-07-29T12:00:00Z",
      updatedAt: "2026-07-29T12:00:00Z"
    },
    {
      id: "note_3",
      subjectId: "sbj_dp",
      tab: "notes",
      type: "note",
      title: "Encoding Categoricals Simplified",
      body: "One-Hot vs Label vs Target Encoding.\n- Never use LabelEncoding on nominal variables without intrinsic order (e.g. Red, Green, Blue) because models treat 2 > 1 > 0 as numeric magnitude!\n- Use One-Hot for low cardinality; Target Encoding / Embeddings for high cardinality (e.g. Zip codes).",
      tags: ["#encoding", "#cheat-sheet"],
      authorId: "user_echo",
      authorName: "Echo.V",
      upvotes: 855,
      downvotes: 5,
      score: 850,
      pointsReward: 290,
      categoryLabel: "Cheat Sheet",
      versionHistory: [],
      createdAt: "2026-07-30T16:30:00Z",
      updatedAt: "2026-07-30T16:30:00Z"
    },
    {
      id: "note_4",
      subjectId: "sbj_dp",
      tab: "notes",
      type: "note",
      title: "Outlier Detection Scripts (Z-Score & IQR)",
      body: "Python helper functions to detect and cap outliers using Tukey 1.5x IQR fencing. Cleaned up for copy-pasting straight into Jupyter.",
      tags: ["#outliers", "#python"],
      authorId: "user_neon",
      authorName: "Neon_Nomad",
      upvotes: 124,
      downvotes: 1,
      score: 123,
      pointsReward: 60,
      categoryLabel: "PDF / Code",
      versionHistory: [],
      createdAt: "2026-08-01T09:15:00Z",
      updatedAt: "2026-08-01T09:15:00Z"
    },

    // Data Preprocessing - Assignments Tab
    {
      id: "asg_1",
      subjectId: "sbj_dp",
      tab: "assignments",
      type: "assignment",
      title: "Assignment 2 Solution Walkthrough & Common Pitfalls",
      body: "Full walkthrough for Question 3 (Handling Data Leakage in Preprocessing Pipelines).\n\n**CRITICAL TIP**: Always fit scalers ONLY on the training split (`scaler.fit_transform(X_train)`), then transform validation/test data (`scaler.transform(X_test)`). Fitting on the whole dataset leaks test variance into training!",
      tags: ["#assignment2", "#important", "#dataleakage"],
      authorId: "user_me",
      authorName: "Riot_Grrl",
      upvotes: 1100,
      downvotes: 4,
      score: 1096,
      pointsReward: 410,
      categoryLabel: "Verified Solution",
      versionHistory: [],
      createdAt: "2026-07-31T11:00:00Z",
      updatedAt: "2026-07-31T11:00:00Z"
    },
    {
      id: "asg_2",
      subjectId: "sbj_dp",
      tab: "assignments",
      type: "assignment",
      title: "Question 4 Curve Fitting & Polynomial Features Guide",
      body: "Detailed steps for constructing interaction terms and polynomial feature maps without exploding dimensionality.",
      tags: ["#assignment2", "#polynomials"],
      authorId: "user_zane",
      authorName: "Zane.X",
      upvotes: 750,
      downvotes: 2,
      score: 748,
      pointsReward: 250,
      categoryLabel: "Step-by-Step",
      versionHistory: [],
      createdAt: "2026-08-01T15:00:00Z",
      updatedAt: "2026-08-01T15:00:00Z"
    },

    // Data Preprocessing - YT Links / Resources Tab
    {
      id: "res_1",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Mastering Pandas: Handling Missing Data Like a Boss",
      body: "CURATED TUTORIALS AND DEEP DIVES FOR DATA PREPROCESSING. UPVOTE THE ONES THAT SAVED YOUR LIFE.",
      externalUrl: "https://www.youtube.com/watch?v=q31tGy3R2T8",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSkApLlzseeAtgJ-ijN_b9NRQ2tN2JYCIOENESGN1BBHYmKjp-vRmyWck2CsSprDXzGlPrVcC06RlxCTAt9e_487kFX50kidvx-rCAg-5p1sAxJPdGq6ikfU9Uf7OHGqzwmsscl5TRrfGazpKyh78fDMlBcFh8wYkzxn7QYvMYFmgkYrDIEY-LlG_IzVnG_dHsYlubvkQjynUrAmrkSHVBKMoy3xNnht5X47TR0UgNQjC4VTeJu51Z",
      duration: "14:22",
      tags: ["#youtube", "#pandas", "#missingdata"],
      authorId: "user_ds",
      authorName: "DataSensei",
      authorInitials: "DS",
      upvotes: 1200,
      downvotes: 0,
      score: 1200,
      pointsReward: 500,
      categoryLabel: "#1 Pick",
      versionHistory: [],
      createdAt: "2026-07-27T08:00:00Z",
      updatedAt: "2026-07-27T08:00:00Z"
    },
    {
      id: "res_2",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Feature Engineering Secrets They Don't Tell You",
      body: "Essential transformation techniques for raw features prior to model training.",
      externalUrl: "https://www.youtube.com/watch?v=0qV1g4S5P44",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClXdpyZt5bzyN2iDe475caBikk0_ri4pvADOCiwumv5ty13fAVua0it16jArr_ojqVASzO_oUcr5Kc4ZTGZAr9MYyzz9x0H16p1aTllHgNSnNpmTUUZc8TT-FPCJqU4-saWMOET4-BeBH-57OVgXnJIHywOGIaM5OodyHBGE04YVyCHj-YrlUiChktbL5v7h-4ci0VspiOW7D2X6g9gt74nEie6conrOsjpoGVrhHxQTO4HZudkNu0",
      duration: "28:15",
      tags: ["#youtube", "#feature-engineering", "#ml"],
      authorId: "user_ml",
      authorName: "ML_Punk",
      authorInitials: "ML",
      upvotes: 842,
      downvotes: 0,
      score: 842,
      pointsReward: 350,
      categoryLabel: "Pro Tips",
      versionHistory: [],
      createdAt: "2026-07-30T10:00:00Z",
      updatedAt: "2026-07-30T10:00:00Z"
    },
    {
      id: "res_3",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Normalization vs Standardization - Stop Guessing",
      body: "Clear breakdown of when to apply StandardScaler vs MinMaxScaler in production.",
      externalUrl: "https://www.youtube.com/watch?v=mnKm3ypVpU4",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDldOJ-DLEGYgzWpwATGU7zMQPAJ_eSoGrgtYXdNNTx5kS6PFROYCODnbWhx5T_jokrJprxGAkWWOn9l9L2Cp3FTUgfINGD-gfPQ3dU_kIdAjk5oVeQLM5zsUj0QjlJ081qQqKkoYcjMfrHWv93sqwrL6rHE4RO6eX-D744PuVbE2hASU3EhI9SUy1qMyCMZ_pCS2M5rYHTOyBxjkGTBH-U17Bb3vIhkbbbayLUVb1qpriu6GEUvXxg",
      duration: "09:45",
      tags: ["#youtube", "#scaling", "#math"],
      authorId: "user_ca",
      authorName: "CodeAlchemist",
      authorInitials: "CA",
      upvotes: 756,
      downvotes: 0,
      score: 756,
      pointsReward: 300,
      categoryLabel: "Must Watch",
      versionHistory: [],
      createdAt: "2026-07-31T12:00:00Z",
      updatedAt: "2026-07-31T12:00:00Z"
    },
    {
      id: "res_4",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Outlier Detection in 5 mins",
      body: "Quick breakdown of Z-score & Tukey IQR outlier filtering.",
      externalUrl: "https://www.youtube.com/watch?v=outlier5",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKdhMsoZsiPF4TKXXyj-XU56IIOR81KNWd_Rl6s_yQJP5HCBqdrmyNu5dd1aHQsSxZg8jQ3WkJo-YG61iPpakfJvZKx7DyPCqsU58GPDf_kQ991mFXjYeIsxcrr9YMNGcWx4JshsxiqO1VSBUps3g43Dbo_AyEvmZG6kkQssYPCuf2BNR1iq0oHFYvzrhx5tWfKTzEmIBEELlaCPlzAv-6emPdt7F6lKHG-TERDA4YbQySxHTzkb3b",
      duration: "05:12",
      tags: ["#outliers", "#statninja"],
      authorId: "user_sn",
      authorName: "StatNinja",
      authorInitials: "SN",
      upvotes: 214,
      downvotes: 0,
      score: 214,
      pointsReward: 100,
      categoryLabel: "Fresh Drop",
      versionHistory: [],
      createdAt: "2026-08-02T10:00:00Z",
      updatedAt: "2026-08-02T10:00:00Z"
    },
    {
      id: "res_5",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Advanced Scikit-Learn Pipelines",
      body: "Chaining ColumnTransformer with Estimators cleanly.",
      externalUrl: "https://www.youtube.com/watch?v=pipelines",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6zKskjpaHe0yP0GkxXXqrUbeAiKr1iTExY5VCkM8tnD2feaezbM3p-xDYkMgHKtj2tyOCEoYu0KKjh-fDuBPwPOvRmTODnEGHVtix6n5B9i2d5HXljVPlMb6IfUyajnHdTnaLDDB_uc6jNzvPWxiLBPFYcJeeqvXvS2pIBt9hX3wzuyQBM09Ur99N4Tz7v8Zpwp-8z6PaAWAgfOTCXm2M1kvkgTpK2lR88NbblrameHBS-rZk9Ryr",
      duration: "18:30",
      tags: ["#sklearn", "#pyguru"],
      authorId: "user_pg",
      authorName: "PyGuru",
      authorInitials: "PG",
      upvotes: 198,
      downvotes: 0,
      score: 198,
      pointsReward: 90,
      categoryLabel: "Fresh Drop",
      versionHistory: [],
      createdAt: "2026-08-02T14:00:00Z",
      updatedAt: "2026-08-02T14:00:00Z"
    },
    {
      id: "res_6",
      subjectId: "sbj_dp",
      tab: "resources",
      type: "resource_link",
      title: "Encoding Categorical Data",
      body: "OneHotEncoder vs TargetEncoder deep dive.",
      externalUrl: "https://www.youtube.com/watch?v=encoding",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD10Z7ZHEd4BY9C2Em-pHCWzLqzk-SfOon3lGhTd_h1-1SUk9DFuhDCQo9b_icAVrUw6zG6zqxxG4Avt9LjMQbevlw62Ssu-Iwd9eeHzZLyqVWODapLsSDyQZuJW_YXOfdLI7_X165KS1lNaICceDBb4zPgkkLUPIXB6ahWfo_vFVQ2Ahrkmo6JIPq3Y9SfyJ3WQONnVTEY2MRFGkZaAQYYjLwDJNmo7ojHb8QYhm9ScPrCBkiyVsK2",
      duration: "11:05",
      tags: ["#encoding", "#datadiva"],
      authorId: "user_dd",
      authorName: "DataDiva",
      authorInitials: "DD",
      upvotes: 156,
      downvotes: 0,
      score: 156,
      pointsReward: 80,
      categoryLabel: "Fresh Drop",
      versionHistory: [],
      createdAt: "2026-08-02T16:00:00Z",
      updatedAt: "2026-08-02T16:00:00Z"
    }
  ],

  votes: [
    { id: "v_1", contentId: "note_1", userId: "user_me", value: 1 }
  ],

  joinRequests: [
    {
      id: "req_101",
      groupId: "grp_ds",
      userId: "user_ghost",
      userName: "INK_GHOST",
      userDepartment: "Computer Science",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvehNyniE3-qJN773z2O6gL0807QA_OdbXNL15dAA_nr1T5EawWd9-bI5YOJVLjsQTufQCfxkeaQnictKITqzGncbfWtkYi2faUIKDlEgALBzGNyNsuMHnl205jeSphnNvAcrM3iIfT6Y3_Fu35uyAKs-xdnkQXY7y7wXMXm2KkllBfAq5JGPgZff0b7KRDYYzgDj9-gPMkxWLBKiyXk9qyaRsPT3p0AfLE37K8G5BByuEtiYwc_7b",
      status: "pending",
      requestedAt: "2026-08-02T18:00:00Z",
      message: "Hey! I am taking Data Preprocessing as an elective this semester and need access to top notes."
    }
  ],

  notifications: [
    {
      id: "notif_1",
      userId: "user_me",
      groupId: "grp_ds",
      subjectId: "sbj_dp",
      type: "new_content",
      title: "New Resource Added",
      message: "Echo.V uploaded a YouTube video in Data Preprocessing: StatQuest Masterclass",
      isRead: false,
      createdAt: "2026-08-02T19:00:00Z"
    },
    {
      id: "notif_2",
      userId: "user_me",
      groupId: "grp_ds",
      subjectId: "sbj_dp",
      type: "exam_alert",
      title: "Exam Countdown Reminder",
      message: "Data Preprocessing Exam is in 12 days! Check the Top 3 Pinned Notes.",
      isRead: true,
      createdAt: "2026-08-02T12:00:00Z"
    }
  ],

  reports: [
    {
      id: "rep_1",
      contentId: "note_4",
      reportedBy: "Zane.X",
      reason: "Potential typo in formula line 4",
      status: "pending",
      createdAt: "2026-08-02T15:30:00Z"
    }
  ],

  subjectRequests: [
    {
      id: "sreq_1",
      groupId: "grp_ds",
      userId: "user_zane",
      userName: "Zane.X",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuARo7NRwfX-W2Rp6vXmShKvuX2Mi2Ma5aQ0nkuZDhJoiI_DM0FITQO50WltQJjwlnQe2jRnd2C6NYBNdLCbOFcsqVql9T_4iJs8uOmcoSJsRbo7EaSa0BplOTw7TBcTLOg-4pLuYxje29NB5_aRkWH7bgxcF5PCiH-zN5OpUfn1K4qKJHWen6mZGlyD9lxzofKy8EcZy-5bkcvwoToSwkUAzmLofY2efb1bH9tV9JauvNlCHu0WqWSN",
      subjectName: "Time Series Forecasting",
      description: "Need a dedicated module for ARIMA, Prophet, and LSTM time series preprocessing notes.",
      status: "pending",
      requestedAt: "2026-08-02T16:00:00Z"
    }
  ]
};

window.AVATAR_PRESETS = [
  { id: 'av_1', name: 'Riot Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=RiotGrrl&backgroundColor=ffe600' },
  { id: 'av_2', name: 'Cyber Punk', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ninja&backgroundColor=41fe8e' },
  { id: 'av_3', name: 'Neon Nomad', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neon&backgroundColor=ffd9f9' },
  { id: 'av_4', name: 'Code Alchemist', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alchemist&backgroundColor=00ffff' },
  { id: 'av_5', name: 'Data Sensei', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sensei&backgroundColor=ffdad6' },
  { id: 'av_6', name: 'Ink Ghost', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ghost&backgroundColor=eeeeee' }
];
