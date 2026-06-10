import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Activity, Goal, Challenge, UserChallenge, Notification, Report, ChatHistory, LeaderboardEntry 
} from '../types';
import { db, auth, googleProvider, isFirebasePlaceholder, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, 
  query, where, orderBy, onSnapshot 
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  activities: Activity[];
  goals: Goal[];
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  notifications: Notification[];
  reports: Report[];
  chats: ChatHistory[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  aiInsights: {
    carbonScore: number;
    todayEmissions: string;
    trendMessage: string;
    insightText: string;
    recommendations: string[];
  } | null;
  requestInsights: () => Promise<void>;
  requestPredictions: () => Promise<any>;
  requestReport: () => Promise<any>;
  sendChatToCoach: (msg: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  logActivity: (category: Activity['category'], emissionsKg: number, details: Activity['details'], date?: string) => Promise<void>;
  addCustomGoal: (title: string, targetReduction: number, period: Goal['period'], category: string, deadline: string) => Promise<void>;
  joinChallenge: (challengeId: string) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  clearCache: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Static Data for premium appearance
const STATIC_CHALLENGES: Challenge[] = [
  {
    id: "challenge_1",
    title: "No Car Week",
    description: "Commit to active transport, public rail, or cycling for all trips under 5km.",
    points: 300,
    duration: "7 Days",
    participantsCount: 1420,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "challenge_2",
    title: "Energy Saver Challenge",
    description: "Trim appliance plugs overnight and use cold laundry cycles for 14 days straight.",
    points: 150,
    duration: "14 Days",
    participantsCount: 890,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "challenge_3",
    title: "Eco Shopping Month",
    description: "Purchase only pre-owned fashion or strictly recycled electronics this month.",
    points: 500,
    duration: "30 Days",
    participantsCount: 650,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const STATIC_LEADERBOARD: LeaderboardEntry[] = [
  { userId: "leader_1", displayName: "Clara Green", avatarUrl: "", totalCarbonSaved: 345, points: 1200, updatedAt: new Date().toISOString() },
  { userId: "leader_2", displayName: "Julian Solar", avatarUrl: "", totalCarbonSaved: 280, points: 950, updatedAt: new Date().toISOString() },
  { userId: "leader_3", displayName: "Eva Wind", avatarUrl: "", totalCarbonSaved: 232, points: 820, updatedAt: new Date().toISOString() },
  { userId: "leader_4", displayName: "Marcus Hydro", avatarUrl: "", totalCarbonSaved: 198, points: 710, updatedAt: new Date().toISOString() }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>(STATIC_CHALLENGES);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(STATIC_LEADERBOARD);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiInsights, setAiInsights] = useState<AppContextType['aiInsights']>(null);

  // Load from local storage for offline fallback state persistence
  useEffect(() => {
    if (isFirebasePlaceholder) {
      const storedUser = localStorage.getItem('ecotrack_user');
      const storedActs = localStorage.getItem('ecotrack_activities');
      const storedGoals = localStorage.getItem('ecotrack_goals');
      const storedUserChallenges = localStorage.getItem('ecotrack_user_challenges');
      const storedNotifs = localStorage.getItem('ecotrack_notifications');
      const storedReports = localStorage.getItem('ecotrack_reports');
      const storedChats = localStorage.getItem('ecotrack_chats');

      if (storedUser) setUser(JSON.parse(storedUser));
      else {
        // Build beautiful default user log
        const defaultUser: User = {
          uid: "demo_user_id",
          email: "prashantmenaria7@gmail.com",
          displayName: "Prashant Menaria",
          country: "India",
          lifestylePreference: "Mixed",
          carbonScore: 78,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUser(defaultUser);
        localStorage.setItem('ecotrack_user', JSON.stringify(defaultUser));
      }

      if (storedActs) setActivities(JSON.parse(storedActs));
      else {
        const defaultActs: Activity[] = [
          {
            id: "act_1",
            userId: "demo_user_id",
            category: "transportation",
            emissionsKg: 18.2,
            date: new Date().toISOString().split('T')[0],
            details: { transportType: "car", distanceKm: 45, fuelType: "gasoline" },
            createdAt: new Date().toISOString()
          },
          {
            id: "act_2",
            userId: "demo_user_id",
            category: "electricity",
            emissionsKg: 5.4,
            date: new Date().toISOString().split('T')[0],
            details: { kwh: 12 },
            createdAt: new Date().toISOString()
          },
          {
            id: "act_3",
            userId: "demo_user_id",
            category: "food",
            emissionsKg: 2.1,
            date: new Date().toISOString().split('T')[0],
            details: { dietType: "Mixed", mealsCount: 3 },
            createdAt: new Date().toISOString()
          }
        ];
        setActivities(defaultActs);
        localStorage.setItem('ecotrack_activities', JSON.stringify(defaultActs));
      }

      if (storedGoals) setGoals(JSON.parse(storedGoals));
      else {
        const defaultGoals: Goal[] = [
          {
            id: "goal_1",
            userId: "demo_user_id",
            title: "Reduce emissions by 20%",
            targetReduction: 50,
            currentProgress: 22.5,
            period: "weekly",
            category: "General",
            completed: false,
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
          },
          {
            id: "goal_2",
            userId: "demo_user_id",
            title: "Use public transport 3x weekly",
            targetReduction: 30,
            currentProgress: 10,
            period: "weekly",
            category: "transportation",
            completed: false,
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
          }
        ];
        setGoals(defaultGoals);
        localStorage.setItem('ecotrack_goals', JSON.stringify(defaultGoals));
      }

      if (storedUserChallenges) setUserChallenges(JSON.parse(storedUserChallenges));
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
      else {
        const defaultNotifs: Notification[] = [
          {
            id: "notif_1",
            userId: "demo_user_id",
            title: "Welcome to EcoTrack AI 🍃",
            message: "Track emissions, log items, join community leagues, and get real-time advice from your AI Carbon Coach.",
            isRead: false,
            createdAt: new Date().toISOString()
          }
        ];
        setNotifications(defaultNotifs);
        localStorage.setItem('ecotrack_notifications', JSON.stringify(defaultNotifs));
      }

      if (storedReports) setReports(JSON.parse(storedReports));
      if (storedChats) setChats(JSON.parse(storedChats));
      else {
        const defaultChats: ChatHistory[] = [{
          id: "chat_init",
          userId: "demo_user_id",
          role: "model",
          message: "Hello Prashant! I am your EcoTrack AI Carbon Coach. Log utilities in your tracker and ask me how to trim emissions or choose cost-efficient green substitutes!",
          createdAt: new Date().toISOString()
        }];
        setChats(defaultChats);
        localStorage.setItem('ecotrack_chats', JSON.stringify(defaultChats));
      }

      setLoading(false);
    } else {
      // Setup live sync with Firebase Authentication and Firestore
      const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let userSnap;
          try {
            userSnap = await getDoc(userDocRef);
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          }

          let profileData: User;
          if (userSnap && userSnap.exists()) {
            profileData = userSnap.data() as User;
          } else {
            profileData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Eco Warrior',
              lifestylePreference: 'Mixed',
              country: 'India',
              carbonScore: 75,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, profileData);
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
            }
          }
          setUser(profileData);

          // Sync data subcollections
          const actsQuery = query(collection(db, 'users', firebaseUser.uid, 'activities'), orderBy('createdAt', 'desc'));
          const unsubActs = onSnapshot(actsQuery, (snapshot) => {
            const list: Activity[] = [];
            snapshot.forEach((d) => list.push(d.data() as Activity));
            setActivities(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/activities`);
          });

          const goalsQuery = query(collection(db, 'users', firebaseUser.uid, 'goals'), orderBy('createdAt', 'desc'));
          const unsubGoals = onSnapshot(goalsQuery, (snapshot) => {
            const list: Goal[] = [];
            snapshot.forEach((d) => list.push(d.data() as Goal));
            setGoals(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/goals`);
          });

          const chalsQuery = query(collection(db, 'users', firebaseUser.uid, 'challenges'), orderBy('joinedAt', 'desc'));
          const unsubChals = onSnapshot(chalsQuery, (snapshot) => {
            const list: UserChallenge[] = [];
            snapshot.forEach((d) => list.push(d.data() as UserChallenge));
            setUserChallenges(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/challenges`);
          });

          const notifsQuery = query(collection(db, 'users', firebaseUser.uid, 'notifications'), orderBy('createdAt', 'desc'));
          const unsubNotifs = onSnapshot(notifsQuery, (snapshot) => {
            const list: Notification[] = [];
            snapshot.forEach((d) => list.push(d.data() as Notification));
            setNotifications(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/notifications`);
          });

          const reportsQuery = query(collection(db, 'users', firebaseUser.uid, 'reports'), orderBy('createdAt', 'desc'));
          const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
            const list: Report[] = [];
            snapshot.forEach((d) => list.push(d.data() as Report));
            setReports(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/reports`);
          });

          const chatsQuery = query(collection(db, 'users', firebaseUser.uid, 'chats'), orderBy('createdAt', 'asc'));
          const unsubChats = onSnapshot(chatsQuery, (snapshot) => {
            const list: ChatHistory[] = [];
            snapshot.forEach((d) => list.push(d.data() as ChatHistory));
            setChats(list);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/chats`);
          });

          setLoading(false);

          return () => {
            unsubActs();
            unsubGoals();
            unsubChals();
            unsubNotifs();
            unsubReports();
            unsubChats();
          };
        } else {
          setUser(null);
          setActivities([]);
          setGoals([]);
          setUserChallenges([]);
          setNotifications([]);
          setReports([]);
          setChats([]);
          setLoading(false);
        }
      });

      return () => unsubscribeAuth();
    }
  }, []);

  // Set-up Initial Insights Call
  useEffect(() => {
    if (user) {
      requestInsights();
    }
  }, [user, activities]);

  // Auth Functions
  const loginWithGoogle = async () => {
    if (isFirebasePlaceholder) {
      // Simulate Google Login
      const mockUser: User = {
        uid: "demo_user_id",
        email: "prashantmenaria7@gmail.com",
        displayName: "Prashant Menaria",
        country: "India",
        lifestylePreference: "Mixed",
        carbonScore: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(mockUser);
      localStorage.setItem('ecotrack_user', JSON.stringify(mockUser));
      return;
    }
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (isFirebasePlaceholder) {
      setUser(null);
      localStorage.removeItem('ecotrack_user');
      return;
    }
    await signOut(auth);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updated);

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_user', JSON.stringify(updated));
    } else {
      try {
        await updateDoc(doc(db, 'users', user.uid), updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  // Log Activity
  const logActivity = async (
    category: Activity['category'], 
    emissionsKg: number, 
    details: Activity['details'],
    date?: string
  ) => {
    if (!user) return;
    const activityDate = date || new Date().toISOString().split('T')[0];
    const newAct: Activity = {
      id: "act_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      category,
      emissionsKg,
      date: activityDate,
      details,
      createdAt: new Date().toISOString()
    };

    const newActivities = [newAct, ...activities];
    setActivities(newActivities);

    // Create reward notification triggers
    const triggerRewards = Math.random() > 0.4;
    let earnedNotification: Notification | null = null;
    if (triggerRewards) {
      earnedNotification = {
        id: "notif_" + Math.random().toString(36).substr(2, 9),
        userId: user.uid,
        title: "Emissions Tracked Successfully! 💚",
        message: `You logged ${emissionsKg.toFixed(1)} kg CO₂ emissions in your tracker. Keep measuring to understand your trend!`,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [earnedNotification!, ...prev]);
    }

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_activities', JSON.stringify(newActivities));
      if (earnedNotification) {
        localStorage.setItem('ecotrack_notifications', JSON.stringify([earnedNotification, ...notifications]));
      }
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'activities', newAct.id), newAct);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/activities/${newAct.id}`);
      }
      if (earnedNotification) {
        try {
          await setDoc(doc(db, 'users', user.uid, 'notifications', earnedNotification.id), earnedNotification);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/notifications/${earnedNotification.id}`);
        }
      }
    }

    // Process Leaderboard Update automatically
    const totalReductionSaved = Math.max(5, 50 - emissionsKg);
    const existingLeader = leaderboard.find(l => l.userId === user.uid);
    let updatedLeaderboardList = [...leaderboard];
    if (existingLeader) {
      const updatedLeader = {
        ...existingLeader,
        totalCarbonSaved: parseFloat((existingLeader.totalCarbonSaved + totalReductionSaved).toFixed(1)),
        points: existingLeader.points + 15,
        updatedAt: new Date().toISOString()
      };
      updatedLeaderboardList = leaderboard.map(l => l.userId === user.uid ? updatedLeader : l);
    } else {
      updatedLeaderboardList.push({
        userId: user.uid,
        displayName: user.displayName,
        totalCarbonSaved: parseFloat(totalReductionSaved.toFixed(1)),
        points: 40,
        updatedAt: new Date().toISOString()
      });
    }

    // Sort Leaderboard desc
    updatedLeaderboardList.sort((a, b) => b.totalCarbonSaved - a.totalCarbonSaved);
    setLeaderboard(updatedLeaderboardList);
  };

  // Goals CRUD
  const addCustomGoal = async (
    title: string, 
    targetReduction: number, 
    period: Goal['period'], 
    category: string,
    deadline: string
  ) => {
    if (!user) return;
    const newGoal: Goal = {
      id: "goal_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      title,
      targetReduction,
      currentProgress: 0,
      period,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline
    };

    const newGoals = [newGoal, ...goals];
    setGoals(newGoals);

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_goals', JSON.stringify(newGoals));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'goals', newGoal.id), newGoal);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/goals/${newGoal.id}`);
      }
    }
  };

  // Join Community Challenge
  const joinChallenge = async (challengeId: string) => {
    if (!user) return;
    const isJoined = userChallenges.some(c => c.challengeId === challengeId);
    if (isJoined) return;

    const newRegistration: UserChallenge = {
      id: "uc_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      challengeId,
      status: 'joined',
      progress: 0,
      joinedAt: new Date().toISOString()
    };

    const updatedUserChals = [newRegistration, ...userChallenges];
    setUserChallenges(updatedUserChals);

    const matchChallenge = challenges.find(c => c.id === challengeId);
    if (matchChallenge) {
      const updatedChallenges = challenges.map(c => 
        c.id === challengeId ? { ...c, participantsCount: c.participantsCount + 1 } : c
      );
      setChallenges(updatedChallenges);
    }

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_user_challenges', JSON.stringify(updatedUserChals));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'challenges', newRegistration.id), newRegistration);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/challenges/${newRegistration.id}`);
      }
    }

    // Add general notification
    const startChalNotif: Notification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      title: "Challenge Initiated! 🚲",
      message: `You entered the community challenge: '${matchChallenge?.title || "Sustain"}'! Save transportation and electricity utilities to earn points.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [startChalNotif, ...prev]);
    
    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_notifications', JSON.stringify([startChalNotif, ...notifications]));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'notifications', startChalNotif.id), startChalNotif);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/notifications/${startChalNotif.id}`);
      }
    }
  };

  // Complete Community Challenge
  const completeChallenge = async (challengeId: string) => {
    if (!user) return;
    const reg = userChallenges.find(c => c.challengeId === challengeId && c.status === 'joined');
    if (!reg) return;

    const updatedReg: UserChallenge = {
      ...reg,
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString()
    };

    const updatedUserChals = userChallenges.map(c => c.id === reg.id ? updatedReg : c);
    setUserChallenges(updatedUserChals);

    // Increase score of user
    const matchChallenge = challenges.find(c => c.id === challengeId);
    const addedPoints = matchChallenge?.points || 150;
    const updatedScore = Math.min(100, (user.carbonScore || 75) + 3);
    await updateProfile({ carbonScore: updatedScore });

    // Add points to leaderboard
    const userLeader = leaderboard.find(l => l.userId === user.uid);
    if (userLeader) {
      const updatedLeader = {
        ...userLeader,
        points: userLeader.points + addedPoints,
        totalCarbonSaved: userLeader.totalCarbonSaved + 15,
        updatedAt: new Date().toISOString()
      };
      setLeaderboard(prev => prev.map(l => l.userId === user.uid ? updatedLeader : l).sort((a,b)=> b.totalCarbonSaved - a.totalCarbonSaved));
    }

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_user_challenges', JSON.stringify(updatedUserChals));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'challenges', reg.id), updatedReg);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/challenges/${reg.id}`);
      }
    }

    // Success notification
    const finishChalNotif: Notification = {
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      title: "Challenge Accomplished! 🎉",
      message: `Bravo! You accomplished the challenge '${matchChallenge?.title}', earning +${addedPoints} Carbon Savings points. Your score increased to ${updatedScore}!`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [finishChalNotif, ...prev]);

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_notifications', JSON.stringify([finishChalNotif, ...notifications]));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'notifications', finishChalNotif.id), finishChalNotif);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/notifications/${finishChalNotif.id}`);
      }
    }
  };

  // Mark notification as read
  const markNotificationRead = async (id: string) => {
    if (!user) return;
    const updatedNotifs = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updatedNotifs);

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_notifications', JSON.stringify(updatedNotifs));
    } else {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'notifications', id), { isRead: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/notifications/${id}`);
      }
    }
  };

  // API Call: Request Insights from server proxy
  const requestInsights = async () => {
    if (!user) return;
    try {
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: activities.slice(0, 5),
          username: user.displayName,
          currentScore: user.carbonScore || 75
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
        if (data.carbonScore && data.carbonScore !== user.carbonScore) {
          updateProfile({ carbonScore: data.carbonScore });
        }
      }
    } catch (err) {
      console.error("Error asking for insights proxy:", err);
    }
  };

  // API Call: Prediction Forecasting Engine
  const requestPredictions = async () => {
    if (!user) return null;
    try {
      const response = await fetch('/api/gemini/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities,
          country: user.country
        })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error("Error asking for predictions:", err);
    }
    return null;
  };

  // API Call: Generate Environmental Audit Report
  const requestReport = async () => {
    if (!user) return null;
    try {
      const response = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities,
          username: user.displayName,
          country: user.country,
          goals
        })
      });
      if (response.ok) {
        const resData = await response.json();
        const newReport: Report = {
          id: "rep_" + Math.random().toString(36).substr(2, 9),
          userId: user.uid,
          title: `Carbon Footprint Audit - Month of ${new Date().toLocaleString('default', { month: 'long' })}`,
          createdAt: new Date().toISOString(),
          emissionsBreakdown: {
            transportation: activities.filter(a => a.category === 'transportation').reduce((acc, curr) => acc + curr.emissionsKg, 0),
            electricity: activities.filter(a => a.category === 'electricity').reduce((acc, curr) => acc + curr.emissionsKg, 0),
            food: activities.filter(a => a.category === 'food').reduce((acc, curr) => acc + curr.emissionsKg, 0),
            shopping: activities.filter(a => a.category === 'shopping').reduce((acc, curr) => acc + curr.emissionsKg, 0),
            waste: activities.filter(a => a.category === 'waste').reduce((acc, curr) => acc + curr.emissionsKg, 0),
          },
          totalEmissions: activities.reduce((acc, curr) => acc + curr.emissionsKg, 0),
          recommendations: [
            "Opt for dynamic train booking during peak logistics hours.",
            "Utilize localized smart thermostats to curb thermal energy usage.",
            "Consolidate daily recyclable parcels to minimize transportation transit."
          ],
          trends: resData.reportMarkdown
        };

        const updatedReports = [newReport, ...reports];
        setReports(updatedReports);

        if (isFirebasePlaceholder) {
          localStorage.setItem('ecotrack_reports', JSON.stringify(updatedReports));
        } else {
          try {
            await setDoc(doc(db, 'users', user.uid, 'reports', newReport.id), newReport);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/reports/${newReport.id}`);
          }
        }

        return newReport;
      }
    } catch (err) {
      console.error("Error making report PDF source:", err);
    }
    return null;
  };

  // API Call: AI Coach Messaging Client
  const sendChatToCoach = async (messageText: string) => {
    if (!user) return;
    const userMsg: ChatHistory = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      role: 'user',
      message: messageText,
      createdAt: new Date().toISOString()
    };

    const tempChats = [...chats, userMsg];
    setChats(tempChats);

    if (isFirebasePlaceholder) {
      localStorage.setItem('ecotrack_chats', JSON.stringify(tempChats));
    } else {
      try {
        await setDoc(doc(db, 'users', user.uid, 'chats', userMsg.id), userMsg);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/chats/${userMsg.id}`);
      }
    }

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: tempChats.slice(-10),
          activities: activities.slice(0, 10)
        })
      });

      if (response.ok) {
        const data = await response.json();
        const modelMsg: ChatHistory = {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          userId: user.uid,
          role: 'model',
          message: data.reply,
          createdAt: new Date().toISOString()
        };

        const finalChats = [...tempChats, modelMsg];
        setChats(finalChats);

        if (isFirebasePlaceholder) {
          localStorage.setItem('ecotrack_chats', JSON.stringify(finalChats));
        } else {
          try {
            await setDoc(doc(db, 'users', user.uid, 'chats', modelMsg.id), modelMsg);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/chats/${modelMsg.id}`);
          }
        }
      }
    } catch (err) {
      console.error("Error in coach chat stream:", err);
    }
  };

  // Delete User Account
  const deleteUserAccount = async () => {
    if (!user) return;
    if (isFirebasePlaceholder) {
      localStorage.clear();
      setUser(null);
      setActivities([]);
      setGoals([]);
      setUserChallenges([]);
      setNotifications([]);
      setReports([]);
      setChats([]);
      return;
    }

    try {
      // In a real database deployment, we delete user's subcollections or parent profile safely
      await deleteDoc(doc(db, 'users', user.uid));
      signOut(auth);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}`);
    }
  };

  const clearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      user,
      activities,
      goals,
      challenges,
      userChallenges,
      notifications,
      reports,
      chats,
      leaderboard,
      loading,
      aiInsights,
      requestInsights,
      requestPredictions,
      requestReport,
      sendChatToCoach,
      loginWithGoogle,
      logout,
      updateProfile,
      logActivity,
      addCustomGoal,
      joinChallenge,
      completeChallenge,
      markNotificationRead,
      deleteUserAccount,
      clearCache
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used inside the AppProvider hierarchy!');
  }
  return context;
};
