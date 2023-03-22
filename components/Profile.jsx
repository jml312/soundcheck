export default function Profile({ isUser }) {
  return <div>{isUser ? "Your profile" : "Someone else's profile"}</div>;
}
