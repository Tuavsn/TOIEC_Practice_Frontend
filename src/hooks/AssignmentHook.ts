import { PaginatorPageChangeEvent } from "primereact/paginator";
import { TreeNode } from "primereact/treenode";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { callGetPracticePaper } from "../api/api";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { LectureID, PracticeQuestion, QuestionNumber } from "../utils/types/type";
import useTopicRef from "./TopicRefHook";

export function useAssignmentTable() {
    // === Lấy test_id từ URL ===
    // Lấy test_id từ URL thông qua hook useParams, nếu không có thì mặc định là "no_idTest_found"
    const { lecture_id = "no_idlecture_found" } = useParams<{ lecture_id: LectureID }>();
    // === Khởi tạo các trạng thái cần thiết ===
    const [currentPageIndex, setCurrentPageIndex] = useState(-1);             // Lưu trang hiện tại
    const [isVisible, setIsVisible] = useState<boolean>(false); // Trạng thái hiển thị của Dialog
    const currentSelectedQuestion = useRef<TreeNode>({});     // Câu hỏi hiện tại được chọn
    const [nodes, setNodes] = useState<TreeNode[]>([]); // Lưu dữ liệu câu hỏi dạng TreeNode
    const [title, setTitle] = useState<string>("Xóa");  // Tiêu đề của Dialog
    const totalItems = useRef<number>(0);        // Lưu tổng số mục, không gây render lại
    const topics = useTopicRef();            // Lưu danh sách chủ đề

    // === Hàm lấy dữ liệu câu hỏi theo trang ===
    const fetchQuestionByPage = useCallback(async (pageIndex: number) => {
        // Gọi API để lấy dữ liệu câu hỏi
        const responseData = await callGetPracticePaper(lecture_id);//callGetAssignmentRows(lecture_id);

        // Lưu trữ tổng số mục
        totalItems.current = responseData.data.totalQuestions;

        // Chuyển đổi dữ liệu thành dạng TreeNode và cập nhật state
        setNodes(ConvertAssignmentRowListToTreeNodeList(responseData.data.practiceQuestions));

        // Cập nhật lại trang hiện tại
        setCurrentPageIndex(pageIndex);
    }, []);

    // === useEffect để gọi fetchQuestionByPage khi khởi tạo ===
    useEffect(() => { SetWebPageTitle("Quản lý câu hỏi"); fetchQuestionByPage(0) }, []); // Gọi hàm fetch dữ liệu câu hỏi lần đầu



    // === Hàm xử lý thay đổi trang ===
    const onPageChange = useCallback(async (event: PaginatorPageChangeEvent) => {
        // Gọi fetchQuestionByPage với trang mới
        await fetchQuestionByPage(event.page);
    }, []);

    // === Giá trị trả về từ hook ===
    return {
        currentSelectedQuestion, // Câu hỏi hiện tại được chọn
        totalItems, // Tổng số mục
        currentPageIndex, // Trang hiện tại
        onPageChange, // Hàm xử lý thay đổi trang
        setIsVisible, // Hàm thay đổi trạng thái hiển thị của Dialog
        isVisible, // Trạng thái hiển thị của Dialog
        setTitle, // Hàm thay đổi tiêu đề của Dialog
        topics, // Danh sách chủ đề
        title, // Tiêu đề của Dialog
        nodes, // Dữ liệu câu hỏi dạng TreeNode
    };
}

function ConvertAssignmentRowListToTreeNodeList(QuestionRowList: PracticeQuestion[]): TreeNode[] {

    // Duyệt qua từng QuestionRow trong danh sách và chuyển đổi thành TreeNode
    const questionNodeList = QuestionRowList.map((questionRow: PracticeQuestion, index: number): TreeNode => {
        return {
            // Chuyển đổi QuestionRow thành TreeNode, bao gồm cả id
            ...ConvertAssignmentRowToNode(questionRow, index + 1),

        }
    });
    return questionNodeList;
}

function ConvertAssignmentRowToNode(questionRow: PracticeQuestion, qNum: QuestionNumber): TreeNode {
    return {
        key: questionRow.id,
        data: {
            //----
            questionNum: qNum,
            type: questionRow.type,
            //------
            ask: questionRow.content,
            choices: questionRow.answers,
            correctChoice: questionRow.correctAnswer,
            transcript: questionRow.transcript,
            explanation: questionRow.explanation,
            //------
            //------
            resources: questionRow.resources,
            //------
        }
    }
}