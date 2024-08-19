import IComment from "../../models/Comment/IComment"
import "./Comment.css"

export default function Comment({ name, comment }: IComment) {
    return (
        <div className="comment">
            <h3>{name}</h3>
            <p>{comment}</p>
        </div>
    )
}
