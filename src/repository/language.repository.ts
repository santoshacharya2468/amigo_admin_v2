import { api } from "@/lib/api"

export interface Language {
  id: number;
  name: string;
  code: string;
}



export interface Translation {
  Feedback: string;
  aboutMe: string;
  acceptFriendRequestButtonText: string;
  accountName: string;
  activatingPremiumWillHelpYouMeetMorePeopleFaster: string;
  address: string;
  age: string;
  agency: string;
  allUsers: string;
  applyButtonText: string;
  arabicLanguage: string;
  asianEthnicity: string;
  atheistReligion: string;
  attachements: string;
  audio: string;
  audioCall: string;
  audioGreeting: string;
  audioGreetingMicHelpText: string;
  availabeEggs: string;
  averageBodyType: string;
  backgroundFilterButtonText: string;
  backgroundInfo: string;
  basicFilterButtonText: string;
  blackEthnicity: string;
  block: string;
  blockedUser: string;
  bodyType: string;
  boost: string;
  boostProfile: string;
  buddhistReligion: string;
  buyCredits: string;
  cancelButtonText: string;
  cancelFriendRequestButtonText: string;
  cashAccounts: string;
  catPets: string;
  changePassword: string;
  chats: string;
  chineseLanguage: string;
  christianReligion: string;
  cm: string;
  coinPurchasePageTitle: string;
  collegeEducation: string;
  confirmNewPassword: string;
  createCashAccountPageTitle: string;
  credit: string;
  curvyBodyType: string;
  dateOfBirth: string;
  debit: string;
  deleteAccount: string;
  description: string;
  discover: string;
  displayFirstInFindMatches: string;
  displayOnTopInRandomUsers: string;
  distance: string;
  divorced: string;
  doctorEducation: string;
  dogPets: string;
  doubleYourChancesForAFriendship: string;
  drink: string;
  dutchLanguage: string;
  editProfile: string;
  eggs: string;
  eggsSetup: string;
  eggsStatements: string;
  email: string;
  engineerEducation: string;
  english: string;
  englishLanguage: string;
  ethnicity: string;
  exchange: string;
  exchangeAll: string;
  exchangeInputFieldHintText: string;
  exchangePassword: string;
  exchangeRequestPageTitle: string;
  exchangeRuleContent: string;
  exchangeRuleTitle: string;
  facebook: string;
  fanButtonText: string;
  featuredUsers: string;
  feedback: string;
  feedbackSubmitSuccessMessage: string;
  feedbackType: string;
  feedbackTypeApplicationError: string;
  feedbackTypeOperations: string;
  feedbackTypeRechargeWithdrawal: string;
  feedbackTypeSuggestions: string;
  feedbacktypeApplicationError: string;
  feedbacktype_application_error: string;
  female: string;
  fieldRequiredErrorMessage: string;
  findPotentialMatchesByCountry: string;
  frenchLanguage: string;
  friendAppAccessNotificationTitle: string;
  fullName: string;
  gender: string;
  germanLanguage: string;
  getAdditionalStickers: string;
  getDiscountWhenBuyBoostMe: string;
  getSeen100XInDiscover: string;
  gift: string;
  giftSentMessage: string;
  global: string;
  goLive: string;
  goLivePageChatTitle: string;
  googlePlus: string;
  height: string;
  help: string;
  helpAndFeedPageTitle: string;
  highlightYourMessages: string;
  hinduReligion: string;
  incomingCallNotificationTitle: string;
  instagram: string;
  interests: string;
  inviteFriends: string;
  italianLanguage: string;
  itiEducation: string;
  japaneseLanguage: string;
  jewishReligion: string;
  judaismReligion: string;
  km: string;
  koreanLanguage: string;
  language: string;
  latinamericanEthnicity: string;
  letsFindNewPeopleAroundYou: string;
  lifeStyleFilterButtonText: string;
  lifestyleInfo: string;
  lifetimePremiumTitle: string;
  like: string;
  likes: string;
  likesBoostDescription: string;
  likesBoostTitle: string;
  linkedIn: string;
  live: string;
  liveEndedText: string;
  liveJoinPassword: string;
  liveStreamCommentBoxText: string;
  login: string;
  loginPageTitle: string;
  loginWithEmail: string;
  loginWithFacebook: string;
  loginWithGmail: string;
  loginWithPhone: string;
  logout: string;
  logoutConfirmationMessage: string;
  looksFilterButtonText: string;
  looksInfo: string;
  male: string;
  married: string;
  match: string;
  matchesBoostDescription: string;
  matchesBoostTitle: string;
  middleeasternEthnicity: string;
  mixedEthnicity: string;
  monthlyPremiumTitle: string;
  montylyPremiumTitle: string;
  moreFilterButtonText: string;
  moreInfo: string;
  moretyleFilterButtonText: string;
  multi: string;
  multiGuestAudio: string;
  multiGuestVideo: string;
  muslimReligion: string;
  myFans: string;
  myFriends: string;
  myProfile: string;
  nearBy: string;
  nepal: string;
  newGiftNotificationTitle: string;
  newLivestreamNotificationTitle: string;
  newMessageNotificationTitle: string;
  newPassword: string;
  no: string;
  noAnswerText: string;
  noMatchFound: string;
  nonePets: string;
  normal: string;
  northamericanEthnicity: string;
  nothingFound: string;
  notifications: string;
  oldPassword: string;
  online: string;
  onlineNow: string;
  onlineNowFilterTitle: string;
  otherBodyType: string;
  otherEducation: string;
  otherEthnicity: string;
  otherPets: string;
  otherReligion: string;
  otpSentMessage: string;
  password: string;
  passwordRequiredValidationMessage: string;
  payOnce: string;
  peopleIDislike: string;
  peopleILike: string;
  peopleWhoLikesMe: string;
  peopleWhoVisitedMe: string;
  pets: string;
  pleaseWait: string;
  porugueseLanguage: string;
  premiumPageTitle: string;
  private: string;
  proUsers: string;
  profileCompletion: string;
  profileInfo: string;
  profileVisitNotificationTitle: string;
  public: string;
  putYoourselfInSearch: string;
  refundPolicyContent: string;
  refundPolicyTitle: string;
  rejectFriendRequestButtonText: string;
  relationship: string;
  religion: string;
  report: string;
  request: string;
  requestExchangeButtonText: string;
  roundBodyType: string;
  russianLanguage: string;
  save51: string;
  save90: string;
  schoolEducation: string;
  searchUser: string;
  seats: string;
  seeLikesNotifications: string;
  seeMoreStickersOnChat: string;
  selectLangaugePageTitle: string;
  selectLocation: string;
  sendAGift: string;
  sendFriendRequestButtonText: string;
  sendGiftButtonText: string;
  setExchangePasswordPageTitle: string;
  settings: string;
  showInPremiumBar: string;
  showOnline: string;
  showProfileOnFindMatchTitle: string;
  single: string;
  skipPremiumButtonText: string;
  slimBodyType: string;
  smoke: string;
  socialLinks: string;
  spanishLanguage: string;
  sportyBodyType: string;
  statistics: string;
  submitButtonText: string;
  submittedFeedback: string;
  success: string;
  supermodelBodyType: string;
  termsOfServices: string;
  twitter: string;
  typeMessage: string;
  typeSomethingToSearch: string;
  unVerified: string;
  unblock: string;
  unfriendButtonText: string;
  universityEducation: string;
  unknown: string;
  updateButtonText: string;
  updateFilterPageTitle: string;
  updateSuccess: string;
  upgrade: string;
  upgradeToPremium: string;
  uploading: string;
  username: string;
  usersSearchBoxHint: string;
  verification: string;
  verified: string;
  verifypassword: string;
  veryLow: string;
  video: string;
  videoCall: string;
  videoGreeting: string;
  visit: string;
  visitBoostDescription: string;
  visitBoostTitle: string;
  visits: string;
  website: string;
  weeklyPremiumTitle: string;
  whiteEthnicity: string;
  whyChoosePremiumMemberships: string;
  widowed: string;
  workAndEducation: string;
  xFreeEggs: string;
  yearlyPremiumTitle: string;
  yes: string;
  youMayAsloLikeText: string;
  yourPopularity: string;
  yrs: string;
}
export class LanguageRepository {
  static async getLanguages(): Promise<Language[]> {
    const response = await api.get('/languages')
    return response.data.data
  }
  static async addLanguage({
    code ,
    name,
    icon,
    description
  }:{
    code: string;
    name: string;
    icon: string;
    description: string;
  }): Promise<void> {
    await api.post('/languages',{
      code,
      name,
      icon,
      description
    })
  }

  static async getTranslations(lang: string): Promise<any> {
    const response = await api.get(`/languages/translations?lang=${lang}`)
    return response.data.data as Translation
  }
  static async addTranslation({
    Language_code,
    values
  }: {
    Language_code: string;
    values: Array<{
      key: string;
      value: string;
    }>;
  }): Promise<void> {
    const response = await api.post('/languages/translations', {
      Language_code,
      values
    });
    return response.data;
  }
}