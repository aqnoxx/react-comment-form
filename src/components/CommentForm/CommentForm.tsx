import { ChangeEvent, useState } from "react";
import "./CommentForm.css";

type FuncFormProps = {
    onClick: (n:string, c:string) => void;
  };

export default function CommentForm({onClick}: FuncFormProps){
    const[commentName, setCommentName] = useState('')
    const[commentText, setCommentText] = useState('')

    function changeNameHandler(event:ChangeEvent<HTMLInputElement>){
        setCommentName(event.target.value)
    }

    function changeTextHandler(event:ChangeEvent<HTMLInputElement>){
        setCommentText(event.target.value)
    }

    return(
        <div className="comments__input">
            <div className="input__wrapper">
                <p>Name</p>
                <input type="text" className="input__name" onChange={changeNameHandler}></input>
                <p>Text</p>
                <input type="text" className="input__comment" onChange={changeTextHandler}></input>
                <button className="comment__create__button" onClick={()=>{onClick(commentName, commentText)}}>click</button>
            </div>
        </div>
    )
}