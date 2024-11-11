// ------------------------ Thành phần bảng câu hỏi dạng cây --------------------------------------

import { Paginator } from "primereact/paginator";
import { TreeNode } from "primereact/treenode";
import { TreeTable } from "primereact/treetable";
import React from "react";
import { LoadingSpinner } from "../../components/Common/Index";
import { useQuestionTable } from "../../hooks/QuestionHook";
import { QuestionTableProps } from "../../utils/types/type";
import { RenderColumnsForTable } from "./ColumnsTreeTable";
import { DialogActionButton } from "./DialogRelate";

// Thành phần hiển thị bảng câu hỏi dạng cây, với các cột và hàng được thiết kế cụ thể
const QuestionTreeTable: React.FC<QuestionTableProps> = React.memo(
    ({
        setContextDialogBody,
        setResourceDialogBody,
        setTopicDialogBody,
    }) => {

        const {
            currentSelectedQuestion,
            currentPageIndex,
            onPageChange,
            setIsVisible,
            totalItems,
            isVisible,
            setTitle,
            topics,
            nodes,
            title,
        } = useQuestionTable();
        // tạo ra màn hình chờ 
        if (currentPageIndex === -1) {
            return <LoadingSpinner text='Dữ liệu đang tải' />
        }
        // Xác định lớp CSS của hàng dựa trên điều kiện (các hàng là PART 1 2 3...7 sẽ có màu xanh dương bao phủ)
        const rowClassName = (node: TreeNode) => {
            return { 'p-highlight': (!node.data.createdAt) };
        }

        return (
            <React.Fragment>
                {/* Dialog dùng để hiển thị nội dung xác nhận xóa hoặc cập nhật câu hỏi. */}
                <DialogActionButton isVisible={isVisible} title={title} topicList={topics} setIsVisible={setIsVisible} currentSelectedQuestion={currentSelectedQuestion} />

                <TreeTable value={nodes} rows={5} scrollable rowClassName={rowClassName}>

                    {RenderColumnsForTable(setContextDialogBody, setResourceDialogBody, setTopicDialogBody, topics,  setTitle, setIsVisible,currentSelectedQuestion)}

                </TreeTable>

                {/* Bộ phân trang, mỗi trang hiển thị 5 câu hỏi */}

                <Paginator first={currentPageIndex * 5} rows={5} totalRecords={totalItems.current} onPageChange={onPageChange} />
            </React.Fragment>

        )
    }
)

export default QuestionTreeTable;