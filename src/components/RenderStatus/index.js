const RenderStatus = ({ status }) => {
  let className = 'bg-blue-500';
  if (status === 'CREATED') {
    className = 'bg-blue-500';
  } else if (status === 'ACCEPTED') {
    className = 'bg-purple-500';
  } else if (status === 'COMPLETED') {
    className = 'bg-yellow-500';
  } else if (status === 'APPROVED') {
    className = 'bg-green-500';
  } else if (status === 'EXPIRED') {
    className = 'bg-red-500';
  }
  return <div className={`text-xs ml-6 px-3 py-1 rounded-full text-white ${className}`}>{status}</div>;
};

export default RenderStatus;
