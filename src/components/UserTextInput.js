import React, {useState} from 'react';

const UserTextInput = ({onFormSubmit}) => {
    const [term, setTerm] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(term);
        setTerm('');
    };

    return (
        <form onSubmit={(e) => onSubmit(e)}
              style={{'textAlign': 'end'}}>
            <input
                type='text'
                style={{width : '50%'}}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder='Type your message and hit ENTER'
            />
        </form>
    );
};
export default UserTextInput;
