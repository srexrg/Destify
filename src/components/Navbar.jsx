import { Button } from "./ui/button";



const Hero = () => {
  const openGitHub = () => {
    window.open("https://github.com/srexrg/Destination-Generator", "_blank");
  };

  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
      <h1 className="text-2xl font-bold py-1.5 px-5 ml-auto;">Destify</h1>
        <Button type="Button" onClick={openGitHub} className="black_btn">
          GitHub
        </Button>
      </nav>

      <h1 className="head_text">
      AI Unveils Dream <br className="max-md:hidden" />
        <span className="blue_gradient">Destinations</span>
      </h1>

      <h2 className="desc">
      Don&apos;t know where to go for this vacation? We got you covered.<br/>
      Explore personalized travel destinations effortlessly
      </h2>
    </header>
  );
};

export default Hero;
