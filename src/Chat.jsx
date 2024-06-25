import React, { useContext, useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash'
const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4040');
    setWs(ws);
    ws.addEventListener('message', handleMessage)
  }, [])

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
    // console.log(people)
  }

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      setMessages(prev => ([...prev, { ...messageData }]));
    }
  }


  const { username, id } = useContext(UserContext);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  const sendMessage = (ev) => {
    ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,

    }));
    setNewMessageText('');
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: id,
      recipient: selectedUserId,
      id: Date.now(),
    }]));

  }

  const messagesWithoutDupes = uniqBy(messages, 'id');
  //to scroll when a new message is send
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({behavior:'smooth', block:'end'});
    }
  }, [messages]);

  return (
    <div className='flex h-screen'>
      <div className='bg-white0 w-1/3 '>
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <div key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={'border-b border-gray-100 rounded-l-lg  flex items-center gap-3 cursor-pointer ' + (userId === selectedUserId ? 'bg-blue-100' : '')}>
            {userId === selectedUserId &&
              <div className='w-[0.35rem] bg-blue-500 rounded-r-lg h-12'></div>
            }
            <div className=' py-3 pl-4 flex gap-2 items-center'>
              <Avatar userId={userId} username={onlinePeople[userId]} />
              <span className='text-gray-600 '>
                {onlinePeople[userId]}
              </span>
            </div>

          </div>
        ))}
      </div>
      <div className='bg-blue-100 flex flex-col w-2/3 p-3'>
        <div className=' flex-grow'>
          {
            !selectedUserId && (
              <div className='flex h-full flex-grow items-center justify-center'>
                <div className='text-gray-400 text-md md:text-xl'>&larr;  Select a person to Chat!!</div>
              </div>
            )
          }{
            !!selectedUserId && (
              <div className='relative h-full'>
                <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                  {
                    messagesWithoutDupes.map(message => {
                      return <div
                        className={" " + (message.sender === id ? ' text-gray-700 text-right' : '  text-white text-left')}>

                        <div className={"text-left inline-block p-2 my-2 rounded-md text-md " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')}>
                          {message.text}
                        </div>
                      </div>
                    })
                  }
                   <div ref={divUnderMessages}></div>
                </div>

              </div>
            )
          }
        </div>
        {
          !!selectedUserId && (
            <form className="flex gap-2" onSubmit={sendMessage}>
              <input type="text"
                value={newMessageText}
                onChange={ev => setNewMessageText(ev.target.value)}
                placeholder="Type your message here"
                className="bg-white flex-grow border rounded-sm p-2" />
              <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          )
        }
      </div>

    </div>
  )
}
{/* //  */ }
export default Chat