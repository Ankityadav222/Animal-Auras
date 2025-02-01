import express from 'express';

const getCredentials = (req, res) => {
    const Credentials = { "username": "admin", "password": "123" };
    res.status(200).json(Credentials);
};

// Exporting the function as an ES module
export { getCredentials };
