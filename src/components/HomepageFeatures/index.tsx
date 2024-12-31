import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: '使用简单',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        {/* 写一段描述， 详细一点 */}
        简单易用，只需要配置数据源，即可快速接入告警系统。
      </>
    ),
  },
  {
    title: '友好的数据源支持',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        支持 Prometheus、VictoriaMetrics、Loki、ElasticSearch、InfluxDB、MySQL、MQTT、Kafka
        等数据源，支持自定义告警规则。
      </>
    ),
  },
  {
    title: '丰富的告警场景',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        支持丰富的告警场景，包括主机、容器、服务等，支持多种告警方式，包括邮件、短信、语音、钉钉、微信等。
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
