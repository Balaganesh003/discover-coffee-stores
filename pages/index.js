import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Banner from '../components/Banner';
import Card from '../components/Card';
import {
  useState,
  useEffect,
  useContext,
} from 'react';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import {
  StoreContext,
  ACTION_TYPES,
} from '../store/store-context';

export async function getStaticProps(
  context
) {
  const coffeeStores =
    await fetchCoffeeStores();

  return {
    props:
      {
        coffeeStores:
          coffeeStores,
      }, // will be passed to the page component as props
  };
}

export default function Home(
  props
) {
  const {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState("");
  const [
    coffeeStoresError,
    setCoffeeStoresError,
  ] =
    useState(
      null
    );

  const {
    dispatch,
    state,
  } =
    useContext(
      StoreContext
    );

  const {
    coffeeStores,
    latLong,
  } =
    state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (
        latLong
      ) {
        try {
          const res =
            await fetch(
              `api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
            );

          const coffeeStores =
            await res.json();

          // setCoffeeStores(fetchedCoffeeStores);
          dispatch(
            {
              type: ACTION_TYPES.SET_COFFEE_STORES,
              payload:
                {
                  coffeeStores:
                    coffeeStores,
                },
            }
          );
        } catch (error) {
          console.log(
            {
              error,
            }
          );
          setCoffeeStoresError(
            error.message
          );
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [
    latLong,
  ]);

  const handleOnBannerClick =
    () => {
      handleTrackLocation();
    };

  return (
    <div
      className={
        styles.container
      }>
      <Head>
        <title>
          Coffee
          Connoisseur
        </title>
        <meta
          name='description'
          content='Generated by create next app'
        />
        <link
          rel='icon'
          href='/favicon.ico'
        />
      </Head>

      <main
        className={
          styles.main
        }>
        <Banner
          buttonText={
            isFindingLocation
              ? 'Locating...'
              : 'View stores nearby'
          }
          handleOnClick={
            handleOnBannerClick
          }
        />
        {locationErrorMsg && (
          <p>
            Something
            went
            wrong
            :{' '}
            {
              locationErrorMsg
            }
          </p>
        )}
        {coffeeStoresError && (
          <p>
            Something
            went
            wrong
            :{' '}
            {
              coffeeStoresError
            }
          </p>
        )}
        <div
          className={
            styles.heroImage
          }>
          <Image
            src='/../public/static/hero-image.png'
            width={
              700
            }
            height={
              400
            }
            alt='Hero-img'
          />
        </div>

        {coffeeStores.length >
          0 && (
          <div
            className={
              styles.sectionWrapper
            }>
            <h2
              className={
                styles.heading2
              }>
              Stores
              near
              me
            </h2>

            <div
              className={
                styles.cardLayout
              }>
              {console.log(
                {
                  coffeeStores,
                }
              )}
              {coffeeStores.map(
                (
                  coffeeStore
                ) => {
                  return (
                    <Card
                      key={
                        coffeeStore.id
                      }
                      name={
                        coffeeStore.name
                      }
                      imgUrl={
                        coffeeStore.imgUrl ||
                        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                      }
                      href={`coffee-store/${coffeeStore.id}`}
                    />
                  );
                }
              )}
            </div>
          </div>
        )}

        {props
          .coffeeStores
          .length >
          0 && (
          <div
            className={
              styles.sectionWrapper
            }>
            <h2
              className={
                styles.heading2
              }>
              Chennai
              stores
            </h2>

            <div
              className={
                styles.cardLayout
              }>
              {props.coffeeStores.map(
                (
                  coffeeStore
                ) => {
                  return (
                    <Card
                      key={
                        coffeeStore.id
                      }
                      name={
                        coffeeStore.name
                      }
                      imgUrl={
                        coffeeStore.imgUrl ||
                        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                      }
                      href={`coffee-store/${coffeeStore.id}`}
                    />
                  );
                }
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
