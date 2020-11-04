import React from 'react';
import MessagesListStyle from './MessagesList.css';

const MessagesList = ({responses}) => {

    console.log('messages', responses);
    let messagesList;
    if(responses){
        messagesList = responses.map((item, index) => {
            return (
                <div key={index} className={`message_${item.senderID === 0 ? "mine" : "notMine"}`}>
                    <p className='date'>{item.date}</p>
                    <h6>{item.text}</h6>
                </div>
            )
        })
    } else {
        messagesList = null;
    }


    return (
        <div className='p-0'>
            {messagesList}
        </div>
    );
};
export default MessagesList;