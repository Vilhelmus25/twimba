import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
let replyId = ''

// if(window.localStorage.getItem('tweets') != null){
// tweetsData.push(window.localStorage.getItem('tweets'))
// console.log(tweetsData.)
// window.localStorage.setItem('tweets', JSON.stringify(tweetsData))
// console.log(window.localStorage.getItem('tweets'))
// }  

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLikeClick(e.target.dataset.like)
    }
    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if (e.target.dataset.reply) {
        replyId = e.target.dataset.reply
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtnClick('tweet-input', replyId)
    }
    else if (e.target.id === 'answerBtn') {
        handleTweetBtnClick('tweet-area', replyId)
    }
    // else if(e.target.dataset.trash){
    // handleTrashClick(e.target.dataset.trash)
    // }
})

function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked) {
        targetTweetObj.likes--
    }
    else {
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    }
    else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render()
}

function handleReplyClick(replyId) {

    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === replyId
    })[0]
    targetTweetObj.isReplying = !targetTweetObj.isReplying
    render()
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// function handleTrashClick(trashId){
// tweetsData.forEach(function(tweet, index){
//         if(tweet.uuid === trashId){
//         }
//     })
// document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
//     render()
// }


function handleTweetBtnClick(target, tweetId) {
    const tweetInput = document.getElementById(target)
    const targetTweetObj = tweetsData.filter(function (tweet) {
        console.log(tweet.uuid, tweetId)
        return tweet.uuid === tweetId
    })[0]

    if (tweetInput.value != "") {
        if (target === 'tweet-area') {
            tweetsData.forEach(function (item) {
                if (item.uuid == targetTweetObj.uuid) {
                    targetTweetObj.isReplying = false;
                    item.replies.unshift({
                        handle: `@Scrimba`,
                        profilePic: `./images/scrimbalogo.png`,
                        likes: 0,
                        retweets: 0,
                        tweetText: tweetInput.value,
                        replies: [],
                        isLiked: false,
                        isRetweeted: false,
                        isReplying: false,
                        uuid: uuidv4()
                    })
                }
            })
        }
        if (target === 'tweet-input') {
            tweetsData.unshift(
                {
                    handle: `@Scrimba`,
                    profilePic: `./images/scrimbalogo.png`,
                    likes: 0,
                    retweets: 0,
                    tweetText: tweetInput.value,
                    replies: [],
                    isLiked: false,
                    isRetweeted: false,
                    isReplying: false,
                    uuid: uuidv4()
                }
            )

        }

    }

    render()
    tweetInput.value = ''
}


function getFeedHtml() {
    let feedHtml = ``
    tweetsData.forEach(function (tweet) {

        let likeIconClass = ''

        if (tweet.isLiked) {
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''

        if (tweet.isRetweeted) {
            retweetIconClass = 'retweeted'
        }

        // let trashIconClass = ''

        // if(tweet.isTrashed){
        //     console.log(data-trash)
        // }

        let repliesHtml = ''

        if (tweet.isReplying) {
            repliesHtml +=
                `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="./images/scrimbalogo.png" class="profile-pic">
            <div>
                <p class="handle">@Scrimba</p>
                <div class="answerSender">
                <textarea id="tweet-area" placeholder="Give your reply here"></textarea>
                <button id="answerBtn">Reply</button>
                </div>
            </div>
        </div>
</div>
`
        }


        tweet.replies.forEach(function (reply) {
            if (tweet.isReplying) {
                repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            }
        })


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
        /* copy this span after the last span:
        
        <span class="tweet-detail trashHover trash-detail">
                            <i class="fa-solid fa-trash "
                            data-trash="${tweet.uuid}"
                            ></i>
        
                        </span>
                        
        */

    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

