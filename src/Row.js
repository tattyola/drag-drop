import React, {useState} from 'react';
import {Button, IconButton, TableCell, TableRow, TextField} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useDrag, useDrop} from "react-dnd";

const ItemType = 'Table Row';

const Row = ({row, index, columns, handleToggleEditRow, handleMoveRow, handleEditRow}) => {
    const [cellStates, setCellStates] = useState(columns.reduce((acc, col) => ({...acc, [col]: row[col]}), {}));
    const handleToggleEdit = () => {
        handleToggleEditRow(index)
    }
    // dragging
    const [, ref] = useDrag({
        type: ItemType,
        item: {index}
    })
    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                handleMoveRow(draggedItem.index, index);
                draggedItem.index = index;
            }
        }
    })
    // save
    const handleSaveRow = () => {
        Object.entries(cellStates).forEach(([col, value]) => {
            handleEditRow(index, col, value)
        })
        handleToggleEditRow(index);
    }
    // cancel
    const handleCancelEdit = () => {
        setCellStates(columns.reduce((acc, col) => (
            {...acc, [col]: row[col]}
        ), {}))
        handleToggleEdit(index)
    }

    return (
        <TableRow ref={(node) => ref(drop(node))}>
            {columns.map((col, ind) => (

                <TableCell key={ind}>{row.editable ? (
                    <TextField
                        value={cellStates[col]}
                        onChange={(e) => setCellStates({...cellStates, [col]: e.target.value})}
                    />
                ) : (
                    row[col]
                )}</TableCell>

            ))}
            <TableCell>
                {row.editable ? (
                    <>
                        <Button onClick={handleSaveRow}>Save</Button>
                        <Button onClick={handleCancelEdit}>Cancel</Button>
                    </>
                ) : (
                    <IconButton onClick={handleToggleEdit}>
                        <EditIcon/>
                    </IconButton>
                )}
            </TableCell>
        </TableRow>
    );
};

export default Row;
