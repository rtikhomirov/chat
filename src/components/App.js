import React, {useState, useEffect} from 'react';
import UserTextInput from "./UserTextInput";
import MessagesList from "./MessagesList";

const App = () => {
    const [saveObject, setSaveObject] = useState(null);
    const [isFirstRequestToServer, setIsFirstRequestToServer] = useState(true);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        /*
        * receive chat history if it was created before
        * */
        //localStorage.clear();
        getHistoryData();
    }, []);

    const getHistoryData = () => {
        let binID = localStorage.getItem('binID');
        let url = 'https://api.jsonbin.io/b/'+binID+'/latest';
        let method = 'GET';
        let secretKey = "$2b$10$YDtgVhxEK66TAA9EZdlatesgavY2FYFd/L0TBgvh1iuDzxPga3NSW";

        if(binID){
            fetch(url, {
                method : method,
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": secretKey
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(body => {
                    console.log('data1', body);
                    setSaveObject([...body]);
                })
                .catch(error => {
                    console.log('error', error.message);
                })
        }
    };

    const onFormSubmit = (value) => {
        let binID = localStorage.getItem('binID');
        let url = isFirstRequestToServer ? 'https://api.jsonbin.io/b' : 'https://api.jsonbin.io/b/'+localStorage.getItem('binID');
        let method = isFirstRequestToServer ? 'POST' : 'PUT';
        let secretKey = "$2b$10$YDtgVhxEK66TAA9EZdlatesgavY2FYFd/L0TBgvh1iuDzxPga3NSW";

        let newCommentObject = {
            'senderID': 0,//0 - mine comment, otherwise - opponent's one
            'text': value,
            'date': new Date().toJSON()
        };

        let objForSaving;
        if(binID){
            objForSaving = [...saveObject, newCommentObject];
        } else {
            if(isFirstRequestToServer){
                objForSaving = [newCommentObject];
            } else {
                objForSaving = [...saveObject, newCommentObject];
            }
        }

        fetch(url, {
            method : method,
            body: JSON.stringify(objForSaving),
            headers: {
                "Content-Type": "application/json",
                "secret-key": secretKey
            }
        })
            .then(response => {
                return response.json();
            })
            .then(body => {
                if(isFirstRequestToServer){
                    //console.log('POST', objForSaving);
                    localStorage.setItem('binID', body.id);
                    setSaveObject(objForSaving);
                } else {
                    //console.log('PUT', body.data);
                    setSaveObject(body.data);
                }
                setIsFirstRequestToServer(false);
                setTimeout(generateServerResponse.bind(null, objForSaving), 500);
            })
            .catch(error => {
                console.log('error', error.message);
            })
    };

    const generateServerResponse = (obj) => {
        let url = 'https://api.jsonbin.io/b/'+localStorage.getItem('binID');
        let method = 'PUT';
        let secretKey = "$2b$10$YDtgVhxEK66TAA9EZdlatesgavY2FYFd/L0TBgvh1iuDzxPga3NSW";

        let newCommentObject = {
            'senderID': 1,//0 - mine comment, otherwise - opponent's one
            'text': 'server answer '+counter,
            'date': new Date().toJSON()
        };

        let objForSaving = [...obj, newCommentObject];

        fetch(url, {
            method : method,
            body: JSON.stringify(objForSaving),
            headers: {
                "Content-Type": "application/json",
                "secret-key": secretKey
            }
        })
            .then(response => {
                return response.json();
            })
            .then(body => {
                console.log('serverBody_2', body);
                setCounter(counter+1);
                setSaveObject(body.data);
            })
            .catch(error => {
                console.log('error', error.message);
            })
    };

    return (
        <div className='card'>
            <div className='card-header'>Messanger</div>
            <div className='card-body'>
                <MessagesList responses={saveObject}/>
            </div>
            <div className='card-footer'>
                <UserTextInput onFormSubmit={onFormSubmit}/>
            </div>
        </div>
    );
};
export default App;