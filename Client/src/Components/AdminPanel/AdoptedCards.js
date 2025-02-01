import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AdoptedCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
        const response = await fetch(`http://localhost:4000/api/pets/${props.pet._id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete pet');
        }

        setShowDeletedSuccess(true);
        props.updateCards(); // Update the parent component to refresh the list
    } catch (err) {
        setShowErrorPopup(true);
        console.error('Error deleting pet:', err.message);
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className='req-container'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`http://localhost:4000/images/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Type:</b> {props.pet.type}</p>
          <p><b>New Owner Email:</b> {props.pet.email}</p>
          <p><b>New Owner Phone:</b> {props.pet.phone}</p>
          <p><b>Adopted: </b>{formatTimeAgo(props.pet.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={handleReject} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : props.deleteBtnText}
          </button>
        </div>
        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Success</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Deleted Successfully from Database...</p>
            </div>
            <button onClick={() => {
              setShowDeletedSuccess(false);
              props.updateCards();
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptedCards;
