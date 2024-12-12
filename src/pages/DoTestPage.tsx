import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import '../App.css';
import { LoadingSpinner } from "../components/Common/Index";
import { UserAnswerSheetFullTest } from "../components/Common/MultipleChoiceQuestion/UserAnswerSheet";
import useTestPage from "../hooks/TestHook";
import { AmINotLoggedIn } from "../utils/AuthCheck";
import { DoTestPageProps, MultipleChoiceQuestion, MultiQuestionAction, SimpleTimeCountDownProps } from "../utils/types/type";
import { FullTestArea } from "../components/Common/MultipleChoiceQuestion/FullTestArea";

function DoTestPage() {


    // Gọi hook tùy chỉnh để lấy danh sách câu hỏi, ánh xạ trang, tổng số câu hỏi và các hàm điều khiển trạng thái
    const {
        id,
        func,
        state,
        dispatch,
        MultiRef,
        onEndTest,
        timeLimitRef,
    } = useTestPage();

    if (AmINotLoggedIn()) return <Navigate to={"/home?login=true"} />


    // Tạo danh sách nút điều hướng dựa trên pageMapper
    const createButtonListElement = useCallback((): JSX.Element[] => {
        if (state.userAnswerSheet.size <= 0) {
            return [<h1 key={"error-button-list"}>Lỗi rồi</h1>];
        }
        let part = 0;
        return state.pageMapper.map((pq, index) => {
            const isOnPage = state.currentPageIndex === pq.page;
            const text = state.userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "";
            const isDisabled = checkIsAllowToChangePage(state.questionList, pq.page, state.currentPageIndex);
            let newPart = false;
            if (part !== pq.part) {
                part = pq.part;
                newPart = true;
            }
    
            return (
                <React.Fragment key={`section_for_each_question_${index}`}>
                    {newPart && <><h5 className="w-full text-blue-600">Part {pq.part}</h5></>}
                    <Button
                        disabled={isDisabled}
                        key={`answer_${index}`}
                        style={{ width: '60px', aspectRatio: '1/1' }}
                        className={"border-round-md border-solid text-center p-2"}
                        label={pq.questionNum.toString()}
                        severity={getColorButtonOnAnswerSheet(text, isOnPage, state.flags[index])}
                        onClick={() => {
                            if (!isOnPage) {
                                dispatch({ type: "SET_CURRENT_PAGE_INDEX", payload: pq.page });
                            }
                        }}
                    />
                </React.Fragment>
            );
        });
    }, [state.userAnswerSheet, state.pageMapper, state.currentPageIndex, state.questionList, state.flags, dispatch]);


    // Render giao diện chính của trang thi
    return (
        <main id="do-test-page" className="w-full h-full flex flex-column">
            <RenderMainPage MultiRef={MultiRef} createButtonListElement={createButtonListElement} func={func}
                dispatch={dispatch} id={id} onEndTest={onEndTest} state={state} timeLimitRef={timeLimitRef}
            />

        </main>
    )


}


//


export default memo(DoTestPage);
//--------------------------------- helpper function for main component

function checkIsAllowToChangePage(questionList: MultipleChoiceQuestion[], page: number, currentPageIndex: number): boolean {
    return (questionList[currentPageIndex].partNum <= 4 || questionList[page].partNum <= 4);
}

type ColorString = 'info' | 'secondary' | 'warning' | 'help';
function getColorButtonOnAnswerSheet(answer: string, isOnPage: boolean, isFlag: boolean): ColorString {
    let returnString: ColorString = 'secondary';
    if (answer) {
        returnString = 'info'
    }
    if (isFlag) {
        returnString = 'warning';
    }
    return isOnPage ? 'help' : returnString;
}

function currentStatusBodyTemplate(answeredCount: number, totalQuestions: number, dispatch: React.Dispatch<MultiQuestionAction>) {

    return (
        <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => dispatch({ type: "SET_USER_ANSWER_SHEET_VISIBLE", payload: true })} />
    )
}

//----------------------------------------------- sub componet
const SimpleTimeCountDown: React.FC<SimpleTimeCountDownProps> = React.memo(
    ({ timeLeftInSecond, onTimeUp }) => {
        const [secondsLeft, setSecondsLeft] = useState(timeLeftInSecond);

        useEffect(() => {
            if (secondsLeft <= 0) {
                onTimeUp();
                return;
            }

            const timer = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }, [secondsLeft]);

        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;

        // Determine background color class based on time left
        const bgColorClass = secondsLeft <= 30 ? 'bg-red-200' : 'bg-blue-200';

        return (
            <div className={` text-center
    align-items-center justify-content-center`}>
                <h5 className={`px-1 inline py-1 ${bgColorClass} border-dashed border-round-md`}>
                    {minutes} phút và {seconds < 10 ? `0${seconds}` : seconds} giây
                </h5>
            </div>
        );
    }
)


const RenderMainPage: React.FC<DoTestPageProps> = (props) => {
    if (props.state.isSumit) {
        return (
            <section>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <LoadingSpinner text="Xin vui lòng chờ...." />
                </div>
            </section>

        )
    }
    if (props.state.questionList.length <= 0) {
        return (
            <section>
                <Link to={`/test/${props.id}`}>
                    <Button className="fixed" label="Quay về" />
                </Link>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <LoadingSpinner text="Xin vui lòng chờ...." />
                </div>
            </section>

        )
    }
    if (!props.state.start) {
        return (
            <section>
                {/* Nút bắt đầu bài thi */}
                <Link to={`/test/${props.id}`}>
                    <Button className="fixed" label="Quay về" />
                </Link>
                <div className="fixed" style={{ left: "50%", top: "50vh", transform: "translate(-50%, -50%)" }}>
                    <div className="text-center">

                        <Button label="Bắt đầu" onClick={() => {
                            // bắt đầu tính giờ đếm số giây đã trôi qua
                            props.MultiRef.current.timeDoTest = Date.now();
                            // mở giao diện làm bài
                            props.func.startTest();
                        }} />
                    </div>
                </div>
            </section>
        )
    }

    const answeredCount = Array.from(props.state.userAnswerSheet.values()).filter(
        (answerPair) => answerPair.userAnswer !== ""
    ).length;


    return (
        <section>
            {/* Giao diện làm bài thi */}

            <section className="flex flex-column justify-content-center">
                {/* Phiếu trả lời của người dùng */}
                <UserAnswerSheetFullTest
                    visible={props.state.isUserAnswerSheetVisible}
                    dispatch={props.dispatch}
                    ButtonListElement={props.createButtonListElement()}
                />

                {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */}
                <Toolbar
                    className="py-1"
                    start={currentStatusBodyTemplate(answeredCount, props.MultiRef.current.totalQuestions, props.dispatch)}
                    center={
                        <SimpleTimeCountDown
                            onTimeUp={() => props.onEndTest()}
                            timeLeftInSecond={props.timeLimitRef.current}
                        />
                    }
                    end={
                        <div className=" flex gap-1">
                            <Button severity={props.state.flags[props.state.currentPageIndex] ? "info" : "secondary"} label="🚩" onClick={() => props.dispatch({ type: "TOGGLE_FLAGS", payload: props.state.currentPageIndex })} />
                            <Button severity="success" label="Nộp bài" onClick={() => props.dispatch({ type: "SET_VISIBLE", payload: true })}
                            />
                        </div>
                    }
                />

                {/* Khu vực chính để hiển thị câu hỏi và các nút điều hướng */}
                <div id="test-area-container" className="max-w-screen p-0">
                    <FullTestArea
                        changePage={props.func.changePage}
                        question={props.state.questionList[props.state.currentPageIndex]}
                        dispatch={props.dispatch}
                        userAnswerSheet={props.state.userAnswerSheet}
                    />
                </div>
                <Dialog visible={props.state.isVisible} header={<b>Bạn có chắc muốn nộp bài</b>} onHide={() => props.dispatch({ type: "SET_VISIBLE", payload: true })}>
                    <div className="flex flex-column gap-4">
                        {answeredCount < props.MultiRef.current.totalQuestions && <h1>Bạn có {props.MultiRef.current.totalQuestions - answeredCount} câu chưa làm !</h1>}
                        <div className="flex justify-content-end">
                            <Button severity="success" label="Chấp nhận nộp bài" onClick={props.onEndTest} />
                        </div>
                    </div>
                </Dialog>
            </section>

        </section>
    )
}
