//The list will show examples of the way a user can interact with the website
// eslint-disable-next-line
const data = [{
    interactions: [
        { name: "User1", friend_amount: 1, likes: 3, dislikes: 1, guess_button_used: "None"},
        { name: "User2", friend_amount: 2, likes: 0, dislikes: 0, guess_button_used: "One time"},
        { name: "User3", friend_amount: 0, likes: 0, dislikes: 0, guess_button_used: "Three times"},
        { name: "User4", friend_amount: 3, likes: 3, dislikes: 0, guess_button_used: "None"},
        { name: "User5", friend_amount: 3, likes: 1, dislikes: 0, guess_button_used: "Two times"}
    ], 
    logic: [
        "The first user only made one friend. He liked User2's picture of Denali, Hawaii and his family",
        "First user disliked User2's comment towards User1's pet.",
        "First User declined to use the guess button. User1 guessed that it was not worth it.",
        "After all, user1 was content with being friends with one user.",
        "Second user decided to have only one friend.",
        "However, User2 decided on forgoing likes and dislikes and did the guess button one time out of curiosity if he could make more friends.",
        "User3 was just browsing around the website. In fact, it is unknown if User3 even logged in as this user had no friends, no likes nor dislikes and used the guess button three times.",
        "User4 had three friends, three likes but no dislikes. This user decided to like three things and disliked nothing but used the guess button zero times.",
        "Finally, User5 has three friends and liked only one item. Here, User5 disliked nothing and used the guess button 2 times."
    ]

}];

function Page_use(data) {
    return <li>{data.name} {data.friend_amount} {data.likes} {data.dislikes} {data.guess_button_used}</li>
}

function Page_use_list(data) {
    return <ul className = "interactions" >{
        data.interactions.map((item, index) => (
            // eslint-disable-next-line
            <Page_use amount = {item.name}
            friend_amount = {item.friend_amount}
            likes = {item.likes}
            dislikes = {item.dislikes}
            guess_button_used = {item.guess_button_used}
            key = {index}
            />
        ))}
    </ul>
}

function Logic_Use(data) {
    return <div className = "logic">
        <h3>What is the logic behind the users?</h3>

    {data.logic.map((logic, index) => (<p key={index}>{logic}</p>))}
    </div>;
}

function Usage(data){
    return <div>
        <h2 onClick={() => console.log("This is the user's interaction")}></h2>
        <Page_use_list interactions = {data} />
        <Logic_Use logic = {data} />
    </div>;
}

function Friends_list(data){
    return <section>
        <h1> {data.title} </h1>
        <div classname = 'Friends_list' > {data.Friends_list.map((data) =>  (
            <Usage key = {data}
            interactions = {data.interactions}
            logic = {data.logic}
            />
        ))}
        </div>
    </section>
}

export default Friends_list