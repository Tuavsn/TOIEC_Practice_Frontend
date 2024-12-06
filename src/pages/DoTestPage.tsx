import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import React, { memo, useEffect, useState } from "react";
import '../App.css';
import { LoadingSpinner, TestArea, UserAnswerSheet } from "../components/Common/Index";
import useTestPage from "../hooks/TestHook";
import { MultipleChoiceQuestion, SimpleTimeCountDownProps, TestType } from "../utils/types/type";

function DoTestPage() {


    // Gọi hook tùy chỉnh để lấy danh sách câu hỏi, ánh xạ trang, tổng số câu hỏi và các hàm điều khiển trạng thái
    const {
        setIsUserAnswerSheetVisible,
        isUserAnswerSheetVisible,
        setCurrentPageIndex,
        setTestAnswerSheet,
        currentPageIndex,
        userAnswerSheet,
        totalQuestions,
        questionList,
        setVisiable,
        pageMapper,
        changePage,
        toggleFlag,
        timeDoTest,
        timeLimit,
        isVisible,
        onEndTest,
        startTest,
        testType,
        flags,
        start,
    } = useTestPage();
    const answeredCount = Array.from(userAnswerSheet.values()).filter(
        (answerPair) => answerPair.userAnswer !== ""
    ).length;
    // Tạo danh sách nút điều hướng dựa trên pageMapper
    const createButtonListElement = (): JSX.Element[] => {
        if (userAnswerSheet.size <= 0) {
            return [<h1 key={"error-button-list"}>Lỗi rồi</h1>];
        }
        let part = 0;
        return pageMapper.map((pq, index) => {
            const isOnPage = currentPageIndex === pq.page;
            const text = userAnswerSheet.get(pq.questionNum)?.userAnswer ?? "";
            const isDisabled = checkIsAllowToChangePage(testType, questionList, pq.page, currentPageIndex);
            let newPart = false;
            if (part != pq.part) {
                part = pq.part;
                newPart = true
            }

            return (
                <React.Fragment key={`section for each question${index}`}>

                    {newPart && <><h5 className="w-full text-blue-600">Part {pq.part}</h5></>}
                    <Button
                        disabled={isDisabled}
                        key={"answer_" + index}
                        style={{ width: '60px', aspectRatio: '1/1' }}
                        className={"border-round-md border-solid text-center p-2"}
                        label={pq.questionNum.toString()}
                        severity={getColorButtonOnAnswerSheet(text, isOnPage, flags[index])} // Cập nhật màu sắc nút theo câu trả lời
                        onClick={() => {
                            if (!isOnPage) {
                                setCurrentPageIndex(pq.page);
                            }
                        }}

                    />
                </React.Fragment>

            );
        })
    }


    // Render giao diện chính của trang thi
    return (
        <main id="do-test-page" className="w-full h-full">
            {(totalQuestions > 0) ?
                <section>
                    {/* Nút bắt đầu bài thi */}
                    {!start && (
                        <div className="flex justify-content-center min-h-screen">
                            <span className="align-content-center">

                                <Button label="Bắt đầu" onClick={() => {
                                    // bắt đầu tính giờ đếm số giây đã trôi qua
                                    timeDoTest.current = Date.now();
                                    // mở giao diện làm bài
                                    startTest();
                                }} />
                            </span>
                        </div>
                    )}

                    {/* Giao diện làm bài thi */}
                    {start && (
                        <section className="flex flex-column justify-content-center">
                            {/* Phiếu trả lời của người dùng */}
                            <UserAnswerSheet
                                visible={isUserAnswerSheetVisible}
                                setVisible={setIsUserAnswerSheetVisible}
                                ButtonListElement={createButtonListElement()}
                            />

                            {/* Thanh công cụ chứa bộ đếm thời gian và nút nộp bài */}
                            <Toolbar
                                className="py-1"
                                start={currentStatusBodyTemplate(answeredCount, totalQuestions, setIsUserAnswerSheetVisible)}
                                center={
                                    <SimpleTimeCountDown
                                        onTimeUp={() => onEndTest()}
                                        timeLeftInSecond={timeLimit.current}
                                    />
                                }
                                end={
                                    <div className=" flex gap-1">
                                        <Button severity={flags[currentPageIndex] ? "info" : "secondary"} label="🚩" onClick={() => toggleFlag(currentPageIndex)} />
                                        <Button
                                            severity="success"
                                            label="Nộp bài"
                                            onClick={() => setVisiable(true)}
                                        />
                                    </div>
                                }
                            />

                            {/* Khu vực chính để hiển thị câu hỏi và các nút điều hướng */}
                            <div id="test-area-container" className="max-w-screen p-0">
                                <TestArea
                                    changePage={changePage}
                                    testType={testType}
                                    question={questionList[currentPageIndex]}
                                    setTestAnswerSheet={setTestAnswerSheet}
                                    userAnswerSheet={userAnswerSheet}
                                />
                            </div>
                            <Dialog visible={isVisible} header={<b>Bạn có chắc muốn nộp bài</b>} onHide={() => setVisiable(false)}>
                                <div className="flex flex-column gap-4">
                                    {answeredCount < totalQuestions && <h1>Bạn có {totalQuestions - answeredCount} câu chưa làm !</h1>}
                                    <div className="flex justify-content-end">
                                        <Button severity="success" label="Chấp nhận nộp bài" onClick={onEndTest} />
                                    </div>
                                </div>
                            </Dialog>
                        </section>
                    )}
                </section>
                : <section className="w-full h-screen flex justify-content-center"><LoadingSpinner text="Xin vui lòng chờ...." /></section>
            }
        </main>
    )


}


//


export default memo(DoTestPage);
//--------------------------------- helpper function for main component

function checkIsAllowToChangePage(testType: TestType, questionList: MultipleChoiceQuestion[], page: number, currentPageIndex: number): boolean {
    return testType === "fulltest" &&
        (questionList[currentPageIndex].partNum <= 4 || questionList[page].partNum <= 4);
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

function currentStatusBodyTemplate(answeredCount: number, totalQuestions: number, setVisible: React.Dispatch<React.SetStateAction<boolean>>) {

    return (
        <Button severity="help" label={`Số câu đã trả lời: ${answeredCount} / ${totalQuestions}`} icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
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
