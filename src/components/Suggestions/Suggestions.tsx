import React, { useRef, useState } from 'react'
import "./Suggestions.css"

const suggestData: Array<String> = ["{{userData.name}}", "{{userData.address}}", "{{adminData.name}}", "{{adminData.address}}", "{{orderData.name}}", "{{orderData.address}}"];
const userData: Array<Object> = [{ name: "Zoha", "address": "Varanasi" }, { name: "Zohan", "address": "Agra" }, { name: "Rahul", "address": "Prayagraj" }, { name: "Mohan", address: "Kanpur" }]

const Suggestions: React.FC = () => {
    const [input, setInput] = useState("");
    const [suggest, setSuggest] = useState<Array<String>>([]);
    const [textarea, setTextArea] = useState<HTMLTextAreaElement>();
    const [cursorPos, setcursorPos] = useState<number>()
    const [suggestionBoxPosition, setSuggestionBoxPosition] = useState({ top: 0, left: 0 });

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = event.target.value;
        await setInput(value);

        if (textAreaRef.current) { await setTextArea(textAreaRef.current); console.log("textarea", textarea); }

        const keyword = value.split(' ').pop();

        if (textAreaRef.current && keyword) {
            console.log("textAreaRef.current.selectionStart", textAreaRef.current.selectionStart)
            console.log("keyword.length", keyword.length)
            if (textAreaRef.current.selectionStart - keyword.length <= 0) setcursorPos(0)
            else setcursorPos(textAreaRef.current.selectionStart - keyword.length)
        

        }

        //prepare an array of suggestions from userData and suggestData
        if (keyword) {
            const suggestionsList = [
                ...suggestData.filter(item => item.includes(keyword)),
                ...userData.flatMap(obj => Object.values(obj).filter(value => typeof value === 'string' && value.includes(keyword)))];
            console.log("suggestionsList", suggestionsList);
            setSuggest(suggestionsList)
        }
        else {
            setSuggest([]);
        }
    }

    // // Identify the text inside "{{ }}" 
    // const regex = /{{([^}]*)$/; 
    // const match = value.match(regex); 


    // if (match) { 
    //     const keyword = match[1]; 
    //     const suggestions = suggestList1.filter(item => 
    //         item.includes(`{{${keyword}`)); 
    //         setSuggest(suggestions);
    //         if (textAreaRef.current) { 
    //             setcursorPos(textAreaRef.current.selectionStart-match[0].length); } 
    //         };
    // else { setSuggest([]); } 
    // } 




    const handleClickSuggestion = (suggestion: String) => {
        console.log("handleClickSuggestion", textarea, cursorPos);
        
        if (textarea && cursorPos !== undefined && cursorPos !== null) {
            // const cursorPos = textarea.selectionStart;
            console.log("handleClickSuggestion", textarea, cursorPos);
            console.log("cursurPos", cursorPos);

            if (cursorPos > 0) {
                const textBeforeCursor = input.substring(0, cursorPos);
                // const textAfterCursor=input.substring(cursorPos);
                const newText = textBeforeCursor + suggestion;
                setInput(newText);
                setSuggest([]);
            }
            else {
                console.log("Else part triggered");
                setInput(` ${suggestion}`);
                setSuggest([]);
            }
            // console.log("newText",newText);

        }
    }

    return (<div className='data-suggestion-container'>
         <h2>Suggestions</h2> 
         <textarea 
         ref={textAreaRef} 
         value={input} 
         onChange={handleInputChange} 
         onClick={() => setSuggest([])} 
         placeholder="Type here..." /> 
         {suggest.length > 0 && (
          <ul 
          className='suggestions-list'
          style={{ top: suggestionBoxPosition.top + 100, left: suggestionBoxPosition.left ,position:'absolute' }}
          > 
          {suggest.map((Suggestion, index) => (
          <li 
          key={index} 
          style={{padding:'5px',margin:'5px' ,cursor:'pointer'}}
          onClick={() => handleClickSuggestion(Suggestion)}>{Suggestion}
          </li>
          )
        )} 
        </ul>
        )
        } 
        </div>);

}
export default Suggestions;
