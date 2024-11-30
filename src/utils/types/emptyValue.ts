import { TreeNode } from "primereact/treenode";
import { CategoryID, CategoryRow, LectureHookState, LectureRow, TestResultSummary, TestReviewHookState, TestRow, UserHookState, UserRow } from "./type";
const emptyDate = new Date(0, 0, 0);
Object.freeze(emptyDate);
export const emptyLectureRowValue: LectureRow = {
    id: "",
    name: "",
    topic: [],
    createdAt: emptyDate,
    updatedAt: emptyDate,
    active: false
} as const

export const emptyTestResultSummaryValue: TestResultSummary = {
    id: "",
    testId: "",
    totalTime: 0,
    totalReadingScore: 0,
    totalListeningScore: 0,
    totalCorrectAnswer: 0,
    totalIncorrectAnswer: 0,
    totalSkipAnswer: 0,
    type: "practice",
    parts: "",
    userAnswers: []
} as const

export const emptyUserRow: UserRow = {
    id: "",
    email: "",
    avatar: "",
    role: {
        createdAt: "",
        updatedAt: "",
        id: "",
        name: "",
        description: "",
        permissions: [],
        active: false
    },
    target: 0,
    isActive: false,
    createdAt: emptyDate,
    updatedAt: emptyDate
} as const

export const emptyCategoryRow: CategoryRow = {
    id: "",
    format: "vô danh",
    year: 2020,
    createdAt: emptyDate,
    updatedAt: emptyDate,
    active: true
} as const;

export function emptyTestRow(category_id: CategoryID): TestRow {
    return {
        id: '',
        name: '',
        active: true,
        idCategory: category_id,
        totalTestAttempt: 0,
        totalQuestion: 200,
        totalScore: 990,
        limitTime: 90,
        totalUserAttempt: 0,
        createdAt: emptyDate,
        updatedAt: emptyDate
    } as const
}

export const initialLectureState: LectureHookState = {
    job: "",
    lectures: [],
    isRefresh: true,
    currentPageIndex: 0,
    currentSelectedLecture: emptyLectureRowValue
} as const

export const initialTestReviewState: TestReviewHookState = {
    isUserAnswerSheetVisible: false,
    testReviewAnswerSheet: [],
    currentPageIndex: 0,
    pageMapper: []
} as const

export const initialUserState: UserHookState = {
    users: [],
    isRefresh: false,
    currentPageIndex: 0,
    job: "",
    currentSelectedUser: emptyUserRow
} as const

export const emptyQuestionTreeNode: TreeNode = {
    key: "",
    data: {
        practiceID: "",
        testID: "",
        //----
        questionNum: "",
        partNum: 1,
        type: "single",
        difficulty: 999,
        //------
        ask: "what are you doing ?",
        choices: ["i am", "am i", "yes", "no"],
        correctChoice: "yes",
        transcript: "this is transcript",
        explanation: "because...",
        //------
        topic: [],
        //------
        resources: [],
        //------
        createdAt: emptyDate,
        updatedAt: emptyDate
    }
} as const;