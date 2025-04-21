import { useRef } from 'react';

//If the user clicks promote: post/picture is placed placed at the top, meaning user wants more to see it

function Promote({imageURL, commenttext}){
    const promoteToTop = useRef(null);
    
    const handlePromote = () => {
        promoteToTop.current?.scrollIntoView({behavior: 'smooth'});
    };

    const handlePromoteImage = () => {
        handlePromote();
        console.log(imageURL);
    };

    const handlePromoteComment = () => {
        handlePromote();
        console.log(commenttext);
    };

    return (
        <div>
            <div ref={promoteToTop}>
                <img src = {imageURL} alt = "uploads" style = {{width: '350px', height: '350px'}} />
                <p>{commenttext}</p>
            </div>
            <button onClick={handlePromoteImage} style = {{backgroundColor: 'rgb(69, 114, 56)'}}>Promote Image</button>
            <button onClick={handlePromoteComment} style = {{backgroundColor: 'rgb(69, 114, 56)'}}>Promote Comment</button>
        </div>
    );
}

export default Promote;