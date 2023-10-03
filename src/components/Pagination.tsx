import { Button } from "@suid/material";
import { Accessor, Setter } from "solid-js";
import "./Pagination.css"
interface PaginationProps {
    page: Accessor<number>;
    setPage: Setter<number>;
    action: Function;
}

export function Pagination(props: PaginationProps) {
    const { page, setPage, action } = props
    return <div class="pagination">
        <Button onClick={() => { setPage((prev) => prev - 1); action() }}>上一页</Button>
        <p>{page()}</p>
        <Button onClick={() => { setPage((prev) => prev + 1); action() }}>下一页</Button>
    </div>

}
