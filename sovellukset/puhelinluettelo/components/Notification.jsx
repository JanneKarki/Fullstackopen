// Notification.jsx

const Notification = ({ message, type }) => {
    if (message === null) return null
  
    const className = type === 'error' ? 'error' : 'notification'
    console.log('Notification type:', type)

    return <div className={className}>{message}</div>
  }
  
  export default Notification
  