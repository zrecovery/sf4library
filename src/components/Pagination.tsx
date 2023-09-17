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
        <button onClick={() => { setPage((prev) => prev - 1); action() }}>上一页</button>
        <p>{page()}</p>
        <button onClick={() => { setPage((prev) => prev + 1); action() }}>下一页</button>
    </div>

}
