import React, { useCallback, useState } from 'react';

export interface PaginationParams {
    page: number;
    rowsPerPage: number;
    handlePageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleRowsPerPageChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export const usePagination = (initialRowsPerPage = 5): PaginationParams => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    const handlePageChange = useCallback(
        (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
            setPage(newPage);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        },
        []
    );

    return {
        page,
        rowsPerPage,
        handlePageChange,
        handleRowsPerPageChange,
    };
};
