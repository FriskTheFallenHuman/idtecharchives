import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Doom 3",
    Svg: require("@site/static/img/doo3.svg").default,
    description: <>Documentation related to Doom 3 and its expansion.</>,
  },
  {
    title: "Quake 4",
    Svg: require("@site/static/img/quake4.svg").default,
    description: (
      <>
        Documentation for Quake 4, has well has some of the engine changes
        introduced by Raven.
      </>
    ),
  },
  {
    title: "Prey (2006)",
    Svg: require("@site/static/img/prey.svg").default,
    description: (
      <>
        Documentation for Prey (2006) and its rather interesting developtment.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
