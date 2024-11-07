import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTestState } from "../../../context/TestStateProvider";
import LoginDialog from "../LoginDialog/LoginDialog";
import Logo from "../../../assets/Header-Logo.png"



// Định nghĩa component Header
export default function Header() {
    // Sử dụng hook useNavigate để điều hướng giữa các trang
    const navigate = useNavigate();
    // Sử dụng useRef để tham chiếu đến OverlayPanel
    const op = useRef<OverlayPanel>(null);

    // Lấy giá trị isOnTest từ context
    const { isOnTest } = useTestState();

    // Định nghĩa logo hiển thị ở đầu header
    const HeaderStart = <img src={Logo} height={70} alt="Logo" />;

    // Định nghĩa danh sách các mục trong header
    const HeaderItems = [
        { label: 'Trang chủ', icon: 'pi pi-home', command: () => handleCommand('/home') },
        { label: 'Khóa học', icon: 'pi pi-book', command: () => handleCommand('/course') },
        { label: 'Đề thi', icon: 'pi pi-folder', command: () => handleCommand('/test') },
        { label: 'Tra cứu', icon: 'pi pi-book', command: () => handleCommand('/lookup') },
    ];

    // Nếu người dùng có vai trò ADMIN, thêm mục Dashboard vào danh sách
    if (localStorage.getItem('role') === 'ADMIN') {
        HeaderItems.push({ label: 'Dashboard', icon: 'pi pi-cog', command: () => handleCommand('/dashboard') });
    }
    // tắt bảng hiển thị khi nhấn vào biểu tượng người dùng
    const toggleOverlayPanel = (e: any) => {
        // Khi nhấn vào nút, toggle OverlayPanel
        if (op.current) {
            op.current.toggle(e);
        }
    }

    // Định nghĩa nội dung hiển thị ở cuối header
    const HeaderEnd = localStorage.getItem('access_token') ? (
        <div className="card flex justify-content-center pr-3">
            <div className="m-auto pr-2">
                {localStorage.getItem('email') /* Hiển thị email người dùng */}
            </div>
            <Button icon="pi pi-user" rounded text raised severity="info" aria-label="User"
                onClick={toggleOverlayPanel}
            />
            <OverlayPanel ref={op}>
                <div className="block">
                    <Button className="block" link onClick={(e) => { toggleOverlayPanel(e); navigate('/profile') }}>Cá nhân</Button>
                    <Button className="block" link>đọc cái gì</Button>
                    <Button className="block" link onClick={() => { localStorage.clear(); navigate('/home'); }}>Thoát</Button>
                </div>
            </OverlayPanel>
        </div>
    ) : (
        <LoginDialog /> // Hiển thị LoginDialog nếu không có access_token
    );

    // Hàm xử lý lệnh điều hướng
    const handleCommand = (path: string) => {
        // Kiểm tra trạng thái kiểm tra
        if (isOnTest) {
            // Hiển thị cảnh báo nếu đang trong trạng thái kiểm tra
            alert('Bạn không thể điều hướng trong khi đang làm bài kiểm tra!');
        } else {
            navigate(path); // Điều hướng đến đường dẫn nếu không phải là trạng thái kiểm tra
        }
    };

    // Trả về giao diện của header
    return (!isOnTest &&
        <div className="fixed top-0 left-0 right-0 z-5">
            <Menubar model={HeaderItems} start={HeaderStart} end={HeaderEnd} /> {/* Hiển thị Menubar với các mục */}
        </div>
    );
}
