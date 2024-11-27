import React from "react";


const HomePage = React.lazy(() => import("./HomePage"));
const UserProfilePage = React.lazy(() => import("./UserProfilePage"));
const TestPage = React.lazy(() => import("./TestPage"));
const TestDetailPage = React.lazy(() => import("./TestDetailPage"));
const TestReviewPage = React.lazy(() => import("./TestReviewPage"));
const LecturePage = React.lazy(() => import("./LecturePage"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));
const LectureDetailsPage = React.lazy(() => import("./LectureDetailsPage"));
const LookUpPage = React.lazy(() => import("./LookUpPage"));
const DoTestPage = React.lazy(() => import("./DoTestPage"));
const ExercisePage = React.lazy(() => import("./ExercisePage"))
const DoExercisePage = React.lazy(() => import("./DoExercisePage"))
export {
    HomePage,
    UserProfilePage,
    TestPage,
    TestDetailPage,
    TestReviewPage,
    LecturePage,
    NotFoundPage,
    LectureDetailsPage,
    LookUpPage,
    DoTestPage,
    ExercisePage,
    DoExercisePage,
};
