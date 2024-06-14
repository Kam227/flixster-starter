import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MovieCard.css';

const MovieCard = (props) => {
    return (
        <div className="movie-card">
            <p className="rating">{props.rating}</p>
            <div>
                <img className="image" onClick={props.open} src={props.image} alt="movie image"/>
                <p className="favorited"onClick={props.favorite}>{props.favorited}</p>
                <p className="watched"onClick={props.watch}>{props.watched}</p>
            </div>
            <p className="title" onClick={props.open}>{props.title}</p>
        </div>
    )
}

MovieCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    open: PropTypes.func.isRequired,
    favorite: PropTypes.func.isRequired,
    favorited: PropTypes.string.isRequired,
    watch: PropTypes.func.isRequired,
    watched: PropTypes.string.isRequired,
}

export default MovieCard;
