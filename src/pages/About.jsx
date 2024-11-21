import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

function About() {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt="about"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
            cumque debitis iste ex iure molestiae laboriosam eveniet quo
            cupiditate minima! Eligendi, corporis consequuntur, similique quos
            dolor tempora hic quibusdam, quasi assumenda ratione velit nulla
            rerum sequi. Laboriosam ipsa distinctio possimus excepturi quis id
            nihil inventore, sequi autem blanditiis quos dolor. Sunt corrupti
            voluptates ullam quo sint in, totam fugiat modi!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur earum illo in quaerat itaque perspiciatis, vitae animi
            magnam possimus, ipsum, quos laboriosam amet nihil? Provident esse
            repellendus illum minus.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis ab
            nemo, asperiores quam quis neque repudiandae, molestias dolorem
            exercitationem assumenda suscipit deleniti dicta. Labore,
            doloremque?
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            quibusdam quos, ipsa non impedit eius corrupti doloremque
            blanditiis. Quis nobis in laborum sint mollitia expedita?
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
            mollitia laudantium sunt, laboriosam obcaecati tenetur explicabo
            autem dicta, voluptatem quasi eligendi tempore iure! Suscipit,
            beatae.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
            adipisci voluptatum excepturi culpa a aperiam! Aut voluptatum iste,
            eos optio ducimus ipsa voluptates nulla cum?
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
}

export default About;
