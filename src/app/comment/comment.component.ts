import { Component, OnInit } from '@angular/core';
import { Comment } from './CommentModel';
let commentArr = new Array();  
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})


export class CommentComponent implements OnInit {
 
  constructor() { }

  ngOnInit() {
     // Fetching commentArr(if exists) from localstorage
    let commentsString = localStorage.getItem("commentArr");
    if(commentsString !== null) {
      commentArr = JSON.parse(commentsString);
      for(let i=0; i<commentArr.length; i++) {
        commentArr[i].lastUpdated = new Date(commentArr[i].lastUpdated); // converting to Date Object
        commentArr[i].childrenIds = JSON.parse(commentArr[i].childrenIds); // converting string back to array form
      }
    }
    document.addEventListener('DOMContentLoaded', (params)=> {
      if(commentArr.length)
        renderComments();
      const addButton = document.getElementById("add-comment");	
      addButton.addEventListener("click", ()=> {
        let name = (<HTMLInputElement>document.getElementById("name")).value;
        let content = (<HTMLInputElement>document.getElementById("comment")).value;
        addComment(name, content, null);
      }, false);
    
      const commentsList = document.getElementById("commentsList");
      commentsList.addEventListener("click", (event)=> {
        if((<HTMLInputElement>event.target).nodeName === 'A' || (<HTMLInputElement>event.target).nodeName === 'BUTTON'){
          let parts = (<HTMLInputElement>event.target).id.split("-");
          let type = parts[0];
          let id = parts[parts.length-1];
          let abc = (<HTMLInputElement>event.target).id.split("reply-")[1]; 
          if(type == 'reply') {
            let inputElem = `
              <li id="input-${abc}">
              <div class="comment-input-row">
                <div>
                  <input type="text" placeholder="Name" id="name-${abc}" class="name-handle" />
                </div>
              </div>
              <div>
                <textarea rows="5" id="content-${abc}" class="comment-box" placeholder="Your reply...."></textarea>
                <div>
                  <button id="addreply-${abc}" class="add-btn">Submit</button>
                </div>
              </div>
              </li>
              `;
      
            let childListElemId = `childlist-${(<HTMLInputElement>event.target).id.split("reply-")[1]}`;
            let childListElem = document.getElementById(childListElemId);
            
            if(childListElem == null) {
              let childListElemCotent = `<ul id="childlist-${(<HTMLInputElement>event.target).id.split("reply-")[1]}"> ${inputElem} </ul>`;
              document.getElementById(`comment-${abc}`).innerHTML += childListElemCotent;								
            } else {
              childListElem.innerHTML = inputElem + childListElem.innerHTML;
            }
          } else if(type == 'addreply') {
            let content = (<HTMLInputElement>document.getElementById(`content-${abc}`)).value;
            let name = (<HTMLInputElement>document.getElementById(`name-${abc}`)).value;
            addComment(name, content, id);
          } else if(type == 'edit') {
            
          }else if(type='delete'){
           
          }
        }
      }, false);
    },false);
    
    // Storing in local storage
    let storeComments = () =>{ 
      // Storing comments in stringified array in local storage
      let val = "[";
      for(let i=0;i<commentArr.length;i++) {
        val += Comment.toJSONString(commentArr[i]);
        (i != commentArr.length - 1) ? val += "," : val += "";
      }
      val += "]";
      localStorage.setItem('commentArr', val);
    }
    
    let renderComment = (comment) => {
      let id = comment.id;
      let listElem = `
          <div class="hr"><hr/></div>
          <li id="comment-${id}" style="max-width:600px;">
           <div class="comment-header">
            <div  class="comment-name">
              ${comment.name}
            </div>
            <div style="color:rgba(0,0,0,0.3);margin-top:20px;">
              posted ${timeAgo(comment.lastUpdated)}
            </div>
          </div> 
          <div>
           ${comment.content}
          </div>
          <div>
             <a href="#" role="button" id="edit-${id}">Edit</a>
            <a href="#" role="button" id="delete-${id}">Delete</a>
            <a href="#" role="button" id="reply-${id}">Reply</a>
          </div>`;
      if(comment.childrenIds.length != 0) {
        listElem += `<ul id="childlist-${id}">`;
        comment.childrenIds.forEach(commentId=> {
          listElem += renderComment(commentArr[commentId]);
        });
        listElem += "</ul>";
      }		
      listElem += "</li>";
      return listElem;
    }
    
    // Pass parent comment from rootComments to renderComment
    let renderComments = ()=> {
      let rootComments = [];
      commentArr.forEach(comment=> {
        if(comment.parentId === null || comment.parentId == "null") {
          rootComments.push(comment);
        }
      });
      let commentList = '';
      rootComments.forEach(comment=> {
        commentList += renderComment(comment);
      });
      document.getElementById("commentsList").innerHTML = commentList;
    }
    
    // Adding new comment to memory and UI
    let addComment = (name, content, parent) => { 
      let comment = new Comment(commentArr.length, name,content,0,0, parent);
      commentArr.push(comment);
      if(parent != null) {
        commentArr[parent].childrenIds.push(commentArr.length-1);
      } 
      storeComments();
      renderComments();
    }
    
  
    
    let timeAgo = (date)=>{
      let currentDate = new Date();
      let yearDiff = currentDate.getFullYear() - date.getFullYear();
    
      if(yearDiff>0)
        return `${yearDiff} year${yearDiff==1? "":"s"} ago`;
      
      let monthDiff = currentDate.getMonth() - date.getMonth();
      if(monthDiff>0)
        return `${monthDiff} month${monthDiff == 1 ? "" : "s"} ago`;
      
      let dateDiff = currentDate.getDate() - date.getDate();
      if (dateDiff > 0)
        return `${dateDiff} day${dateDiff == 1 ? "" : "s"} ago`;
      
      let hourDiff = currentDate.getHours() - date.getHours();
      if (hourDiff > 0)
        return `${hourDiff} hour${hourDiff == 1 ? "" : "s"} ago`;
    
      let minuteDiff = currentDate.getMinutes() - date.getMinutes();
      if (minuteDiff > 0)
        return `${minuteDiff} minute${minuteDiff == 1 ? "" : "s"} ago`;
      return `a few seconds ago`;
    }
  }

  

  
  
}

