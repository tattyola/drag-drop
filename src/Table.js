import React, {useState} from 'react';
import Row from "./Row";
import {
    Button,
    Checkbox,
    FormControlLabel,
    TableCell,
    TextField
} from "@mui/material";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const Table = () => {

    const initialColumns = ['Client Name', 'Phone', 'Data'];
    const initialData = [
        {'Client Name': 'Alisa', 'Phone': '123', 'Data': 'buyer', 'editable': false},
        {'Client Name': 'John', 'Phone': '456', 'Data': 'seller', 'editable': false},
        {'Client Name': 'Robert', 'Phone': '789', 'Data': 'tech', 'editable': false},
    ];
    const [columns, setColumns] = useState(initialColumns);
    const [tableData, setTableData] = useState(initialData);
    const [newRow, setNewRow] = useState({});
    const [newColumn, setNewColumn] = useState('')
    const [showAddRowForms, setShowAddRowForms] = useState(false)
    const [showNewColumnForms, setShowNewColumnForms] = useState(false)

    // columns
    const handleCheckboxChange = (event) => {
        const columnName = event.target.name;
        if (event.target.checked) {
            setColumns([...columns, columnName])
        } else {
            setColumns(columns.filter(col => col !== columnName))
        }
    }
    const handleNewColumnChange = (event) => {
        setNewColumn(event.target.value);
    }
    const handleAddColumn = () => {
        if (newColumn.trim() !== '') {
            setColumns([...columns, newColumn]);
            setNewColumn('');
            // setShowNewColumnForms(false)
        }
    }
    // rows
    const handleNewRowChange = (event) => {
        setNewRow({...newRow, [event.target.name]: event.target.value})
    }
    const handleAddRow = () => {
        setTableData([...tableData, {...newRow, editable: false}]);
        setNewRow({});
        setShowAddRowForms(false);
    }
    // editing row
    const handleToggleEditRow = (index) => {
        if (tableData[index].editable) {
            const newData = [...tableData];
            newData[index].editable = false;
            setTableData(newData);
        } else {
            const newData = tableData.map((row, i) =>
                i === index ? {...row, editable: true} : row
            );
            setTableData(newData)
        }
    }
    const handleEditRow = (index, col, value) => {
        const newData = [...tableData];
        newData[index][col] = value;
        setTableData(newData);
    }
    // dragging
    const handleMoveRow = (fromIndex, toIndex) => {
        const newData = [...tableData]
        newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0])
        setTableData(newData)
    }

    return (
        <DndProvider backend={HTML5Backend}>

            <div>
                <Button
                    onClick={() => setShowNewColumnForms(!showNewColumnForms)}
                >Add Column</Button>

                {showNewColumnForms && (
                    <div>
                        <TextField
                            value={newColumn}
                            label='New Column'
                            onChange={handleNewColumnChange}
                        />
                        <Button
                            onClick={handleAddColumn}
                        >Add</Button>

                        <div>

                            {columns.map((col, ind) => (
                                <FormControlLabel
                                    key={ind}
                                    control={
                                        <Checkbox
                                            checked={columns.includes(col)}
                                            name={col}
                                            onChange={handleCheckboxChange}
                                        />
                                    }
                                    label={col}
                                />
                            ))}

                        </div>


                    </div>
                )}

                <Button
                    onClick={() => setShowAddRowForms(!showAddRowForms)}
                >Add Row</Button>
                {showAddRowForms && (
                    <div>
                        {columns.map((col, ind) => (
                            <TextField
                                key={ind}
                                label={col}
                                name={col}
                                value={newRow[col] || ''}
                                onChange={handleNewRowChange}
                            />
                        ))}
                        <Button
                            onClick={handleAddRow}
                        >Add</Button>
                    </div>
                )}

            </div>

            <div>

                {columns.map((col, ind) => (
                    <TableCell key={ind}>{col}</TableCell>
                ))}
            </div>

            <div>
                {tableData.map((row, index) => (
                    <Row
                        key={index}
                        row={row}
                        index={index}
                        columns={columns}
                        handleToggleEditRow={handleToggleEditRow}
                        handleMoveRow={handleMoveRow}
                        handleEditRow={handleEditRow}
                    />

                ))}
            </div>

        </DndProvider>
    );
};

export default Table;
