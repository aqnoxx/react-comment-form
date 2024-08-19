import CommentForm from "../CommentForm/CommentForm";
import Comment from "../Comment/Comment";
import "./Post.css";
import { useState } from "react";
import IComment from "./../../models/Comment/IComment";

interface IPost{
    title: string,
    img: string,
    comments: IComment[]
}


export default function Post({title,img,comments}:IPost){
    const [comm, setComm] = useState(comments)

    function createComment(n:string,c:string){
        const newcomm: IComment[] = [...comm]
        newcomm.push({name:n, comment:c})
        setComm(newcomm)
    }

    return(
        <>
        <div className="title">
            <h1>{title}</h1>
        </div>
        <div className="post__img"></div>
        <CommentForm onClick={createComment}/>
        {
             comm.map((e)=>{
                return <Comment name={e.name} comment={e.comment} />
            })
        }
        </>
    )
}