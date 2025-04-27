// lib/reservations.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ReservationPayload {
  stationId: number;
  reservationTime: string; // ISO 8601 format
}

/**
 * Create a new reservation
 * @param payload Reservation data
 * @param token Authentication token
 * @returns Promise with the response data
 */
export const createReservation = async (payload: ReservationPayload, token: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        station_id: payload.stationId,
        reservation_time: payload.reservationTime,
        status: 'pending'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Reservation error:', error);
    throw error;
  }
};

/**
 * Get user reservations
 * @param userId User ID
 * @param token Authentication token
 * @returns Promise with array of reservations
 */
export const getUserReservations = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations?user_id=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

/**
 * Cancel a reservation
 * @param reservationId Reservation ID to cancel
 * @param token Authentication token
 * @returns Promise with the response data
 */
export const cancelReservation = async (reservationId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'cancelled'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel reservation');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel reservation error:', error);
    throw error;
  }
};