export function ReturnButton({ text, onClick }) {
  return (
    <button onClick={onClick} className="w-32 px-4 py-2">
      <p className="text-cnsc-primary-color underline-animate">{text}</p>
    </button>
  );
}
export function Submitbutton() {
  return (
    <button
      type="submit"
      className="border-2 w-32 py-2 px-4
      border-cnsc-primary-color text-cnsc-primary-color
      hover:bg-cnsc-primary-color hover:text-white
      transition-all duration-300   rounded"
    >
      Submit
    </button>
  );
}
export function primaryButtonWithIcon({ text, onClick, icon }) {
  return (
    <button
      className="bg-cnsc-primary-color text-white px-4 py-2 rounded flex items-center gap-2"
      onClick={onClick}
    >
      {icon}
      {text}
    </button>
  );
}
export function secondaryButton({ text, onClick }) {
  return (
    <button
      className="bg-cnsc-secondary-color text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
export function tertiaryButton({ text, onClick }) {
  return (
    <button
      className="bg-cnsc-tertiary-color text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
