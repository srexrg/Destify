import { Button } from "./ui/button";



const Hero = () => {
  const openGitHub = () => {
    window.open("https://github.com/srexrg", "_blank");
  };

  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <Button type="Button" onClick={openGitHub} className="black_btn">
          GitHub
        </Button>
      </nav>

      <h1 className="head_text">
      AI Unveils Dream <br className="max-md:hidden" />
        <span className="orange_gradient">Destinations</span>
      </h1>

      <h2 className="desc">
      Embark on journeys with AI: Explore personalized travel destinations effortlessly
      </h2>
    </header>
  );
};

export default Hero;
