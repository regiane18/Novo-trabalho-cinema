import React, { useEffect, useState } from 'react';
import './App.css';
import TMDB from './TMDB';
import MovieRow from './components/MovieRow';
import FeatureMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {
    const [movieList, setMovieList] = useState([]);
    const [featuredData, setfeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {   
            // pegando a lista
            let list = await TMDB.getHomeList();
            setMovieList(list);

            // pegando o featured
            let originals = list.filter(i=> i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await TMDB.getMovieInfo(chosen.id, 'tv');
            setfeaturedData(chosenInfo);
            
        }
        loadAll();
    }, []);

    useEffect(() => {
        const scrollListiner = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListiner);
        return () => {
            window.removeEventListener ('scroll', scrollListiner);
        }
    }, []);

    return (
        <div className="page">
            <Header black={blackHeader} />
            {featuredData &&
                <FeatureMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito com <span role="img" aria-label="coração">❤</span> por Matheus Polidoro <br />
                Direitos de imagem para Netflix<br />
                Dados pegos do site TheMoviedb.org
            </footer>
            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="" alt="Carregando" width="500px" />
                </div>
            }
        </div>
    );
}