import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setShowErrorPopup(false); // Reset error state before operation
    try {
      // Approve the pet
      const approveResponse = await fetch(`http://localhost:4000/api/pets/approving/${props.pet._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          email: props.form.email,
          phone: props.form.phoneNo,
          status: 'Adopted'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!approveResponse.ok) {
        throw new Error('Failed to approve pet');
      }

      // Delete forms associated with the pet
      const deleteResponse = await fetch(`http://localhost:4000/api/adoptForm/delete/pets/many/${props.form.petId}`, {
        method: 'DELETE'
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete forms');
      }

      setShowApproved(true);
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error handling approval:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsDeleting(true);
    setShowErrorPopup(false); // Reset error state before operation
    try {
      const response = await fetch(`http://localhost:4000/api/adoptForm/reject/${props.form._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      setShowDeletedSuccess(true);
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error rejecting form:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='req-container'>
      <div className='pet-view-card'>
        <div className='form-card-details'>
          <p><b>Email: </b>{props.form.email}</p>
          <p><b>Phone Number: </b>{props.form.phoneNo}</p>
          <p><b>Living Situation: </b>{props.form.livingSituation}</p>
          <p><b>Previous Pet Experience: </b>{props.form.previousExperience}</p>
          <p><b>Having Other Pets? </b>{props.form.familyComposition}</p>
          <p>{formatTimeAgo(props.form.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={handleReject} disabled={isDeleting || isApproving}>
            {isDeleting ? 'Deleting...' : props.deleteBtnText}
          </button>
          <button onClick={() => setShowDetailsPopup(true)}>View Full</button>
          {props.approveBtn &&
            <button onClick={handleApprove} disabled={isDeleting || isApproving}>
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
          }
        </div>

        {/* Approved Popup */}
        {showApproved && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Pet is Adopted Successfully...</p>
              <p>
                Please contact the Adopter at{' '}
                <a href={`mailto:${props.form.email}`}>{props.form.email}</a>{' '}
                or{' '}
                <a href={`tel:${props.form.phoneNo}`}>{props.form.phoneNo}</a>{' '}
                to arrange the transfer of the pet from our adoption center to their house.
              </p>
            </div>
            <button onClick={() => {
              props.updateCards();
              setShowApproved(false);
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Rejected Popup */}
        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Request Rejected Successfully...</p>
            </div>
            <button onClick={() => {
              props.updateCards();
              setShowDeletedSuccess(false);
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Error Popup */}
        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Request Rejected Successfully...</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Details Popup */}
        {showDetailsPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <h2>{props.pet.name}</h2>
              <p><b>Email: </b>{props.form.email}</p>
              <p><b>Phone Number: </b>{props.form.phoneNo}</p>
              <p><b>Living Situation: </b>{props.form.livingSituation}</p>
              <p><b>Previous Pet Experience: </b>{props.form.previousExperience}</p>
              <p><b>Having Other Pets? </b>{props.form.familyComposition}</p>
              <p>{formatTimeAgo(props.form.updatedAt)}</p>
            </div>
            <button onClick={() => setShowDetailsPopup(false)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormCard;
