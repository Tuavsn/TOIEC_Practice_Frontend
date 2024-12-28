import { Button } from "primereact/button"
import { ScrollPanel } from "primereact/scrollpanel"
import React from "react"
import { ConvertThisFullTestQuestionToHTML } from "../../../utils/helperFunction/convertToHTML"
import { FullTestAreaProps } from "../../../utils/types/props"

export const FullTestArea: React.FC<FullTestAreaProps> = React.memo(
    ({ changePage, question, setAnsweredCount }) => {

        const [resourcesElement, questionsElement] = ConvertThisFullTestQuestionToHTML(question, changePage, setAnsweredCount);
        return (
            <div className="flex xl:flex-row lg:flex-row flex-wrap md:flex-column sm:flex-column justify-content-between gap-1 custom-scrollpanel px-0 py-0 align-items-center"
            >
                <ScrollPanel
                    className="flex-1 border-round m-2 shadow-2 min-h-full"
                    style={{ minHeight: '50px', overflowY: 'auto', minWidth: '600px', maxHeight: '700px' }}
                >
                    {resourcesElement}
                </ScrollPanel>

                <div className="flex-1 align-items-stretch" style={{ minWidth: '600px' }}>
                    {(question.partNum > 4) &&
                        <div className="flex justify-content-end px-3 pt-2">
                            <b className="py-0 m-auto text-blue-300">Phần {question.partNum}</b>
                            <span>
                                <Button className="py-0 mr-1" icon="pi pi-angle-double-left" onClick={() => changePage(-1)}></Button>
                                <Button className="py-0" icon="pi pi-angle-double-right" onClick={() => changePage(1)}></Button>
                            </span>
                        </div>
                    }
                    <ScrollPanel
                        className="custombar1 border-round m-2 shadow-2 pl-2"
                        style={{ minHeight: '50px', overflowY: 'auto', maxHeight: '700px', flex: '1 1 auto' }}
                    >
                        {questionsElement}
                    </ScrollPanel>
                </div>
            </div>
        );
    }
)
