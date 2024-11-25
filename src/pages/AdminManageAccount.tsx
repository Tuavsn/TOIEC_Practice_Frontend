import { Card } from "primereact/card";
import React, { memo } from "react";
import { Toast } from "primereact/toast";
import { SimpleDialog } from "../components/Common/Dialog/SimpleDialog";
import { GenericTable } from "../components/Common/Index";
import { UserRow } from "../utils/types/type";
import { SimpleToolBar } from "../components/Common/ToolBar/ToolBar"
import { useDataTable } from "../hooks/GenericDataTableHook";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { timeStampBodyTemplate, statusBodyTemplate } from "../components/Common/Table/CommonColumn";
function AdminManageAccountPage() {

    const emptyAccount: UserRow = {
        id: "",
        email: "",
        avatar: "",
        roleName: "",
        target: 0,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    const {
        row, setRow, rows,
        selectedRows,
        globalFilter,
        dt, toast,
        hideDeleteRowsDialog,
        deleteRowsDialog,
        rowDialog,
        deleteSelectedRows,
        saveRow,
        hideDialog,
        hideDeleteRowDialog,
        deleteRow,
        submitted,
        totalRecords,
        page,
        deleteRowDialog,
        openNew,
        confirmDeleteSelected,
        exportCSV,
        editRow,
        confirmDeleteRow,
        setSelectedRows,
        setGlobalFilter,
        handleOnPage
    } = useDataTable<UserRow>("testusers", emptyAccount
        , (state) => ({
            saveRow: () => {
                state.setSubmitted(true);
                if (state.row.format.trim()) {
                    const _rows = [...state.rows];
                    const _row = { ...state.row };

                    if (state.row.id) {
                        const index = _rows.findIndex(item => item.id === state.row.id)

                        _rows[index] = _row;
                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Updated', life: 3000 });
                    } else {
                        (_row as any).id = crypto.randomUUID();

                        _rows.push(_row);
                        state.toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Row Created', life: 3000 });
                    }

                    state.setRows(_rows);
                    console.log(_rows);
                    state.setRowDialog(false);
                    state.setRow(emptyAccount);
                }
            },
        })
    );

    const renderColumns = [
        <Column key="col-email" field="email" header="Email" sortable filter align="center"/>,
        <Column key="col-timestamp" header="Ngày" body={timeStampBodyTemplate} sortable />,
        <Column key="col-role" field="role" header="Vai trò" align="center"/>,
        <Column key="col-isActive" field="isActive" header="Hoạt động" sortable body={statusBodyTemplate}  bodyClassName="text-center"/>,
    ];

    return (
        <React.Fragment>
            <div key={'b'}>
                {/* <CustomBreadCrumb items={breadCrumbItems} /> */}
                <Card className="my-2">
                    <div key={'a'}>
                        <Toast ref={toast} />
                        <div className="card">
                            <SimpleToolBar
                                openNew={openNew}
                                confirmDeleteSelected={confirmDeleteSelected}
                                selectedRows={selectedRows}
                                exportCSV={exportCSV}
                            />
                            {GenericTable<UserRow>(renderColumns, dt, rows, true, selectedRows, globalFilter, setGlobalFilter, setSelectedRows, totalRecords, page, handleOnPage, editRow, confirmDeleteRow)}
                        </div>
                        {SimpleDialog(
                            dialogBody(row, setRow, submitted),
                            rowDialog,
                            hideDialog,
                            saveRow,
                            row,
                            deleteRowsDialog,
                            hideDeleteRowsDialog,
                            deleteSelectedRows,
                            hideDeleteRowDialog,
                            deleteRow,
                            deleteRowDialog
                        )}
                    </div>
                </Card>
            </div>
        </React.Fragment>
    )
}


export default memo(AdminManageAccountPage);


// ------------------------------------- helper function---------------------------------------------------

//------------------------for dialog-------------------------------------

function dialogBody(row: UserRow, setRow: (value: React.SetStateAction<UserRow>) => void, submitted: boolean) {
    const onInputChange = (e: any, field: keyof UserRow) => {
        const value = e.target.value ?? ''; // Ensuring fallback to an empty string if value is undefined
        setRow((prevRow) => ({
            ...prevRow,
            [field]: value
        }));
    };

    return (

        <div className="field">
            <label htmlFor="name" className="font-bold">email</label>
            <InputText
                id="name"
                value={row.email}
                onChange={(e) => onInputChange(e, 'email')}
                required
                autoFocus
                className={classNames({ 'p-invalid': submitted && !row.email })}
            />
            {submitted && !row.email && <small className="p-error">format is required.</small>}
        </div>

    )
}