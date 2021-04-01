import { useEffect, useState } from 'react';
import { ApiResponse } from '@customTypes/apiTypes';
import { api } from '@utils';
import styles from '@styles/HomePage.module.scss';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ApiResponse>();

  useEffect(() => {
    api
      .get('https://api.openbrewerydb.org/breweries')
      .then((res: ApiResponse) => {
        setData(res.data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.HomePage}>
      <h1>Data loaded!</h1>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </div>
  );
};

export default HomePage;
