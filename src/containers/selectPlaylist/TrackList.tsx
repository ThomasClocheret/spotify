// src/containers/selectPlaylist/TrackList.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { reorderTracksRequest } from '../editPlaylist/slice';
import { RootState } from "../../store/store";

// Components
import Track from '../../components/track/Track';

interface TrackListProps {
  tracks: any[];
  playlistId: string;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks: initialTracks,
  playlistId,
}) => {
  const [tracks, setTracks] = useState(initialTracks);
  const dispatch = useDispatch();
  const { isLoading, error, snapshotId } = useSelector(
    (state: RootState) => state.editPlaylist
  );
  const previousTracksRef = useRef<any[]>(initialTracks);

  // Update the state when initialTracks prop changes
  useEffect(() => {
    setTracks(initialTracks);
    previousTracksRef.current = initialTracks;
  }, [initialTracks]);

  // Handle errors by reverting the tracks to the previous state
  useEffect(() => {
    if (error) {
      alert(`Failed to reorder tracks: ${error}`);
      setTracks(previousTracksRef.current);
    }
  }, [error]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If the item was dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log("Items in the same position, no move");
      return;
    }

    // Save the current state in case we need to revert
    previousTracksRef.current = tracks;

    // Handle the actual reordering logic
    const items = Array.from(tracks);
    const [movedTrack] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedTrack);

    // Optimistically update the UI
    setTracks(items);

    // Dispatch the reorder request
    dispatch(
      reorderTracksRequest({
        playlistId,
        rangeStart: source.index,
        insertBefore: destination.index,
        snapshotId,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="tracks">
        {(provided) => (
          <div
            className="track-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tracks.map((item, index) => (
              <Draggable
                key={item.track.id}
                draggableId={item.track.id.toString()} 
                index={index}
              >
                {(provided, snapshot) => (
                  <Track
                    track={item.track}
                    index={index}
                    isDragging={snapshot.isDragging}
                    provided={provided}
                    snapshot={snapshot}
                    playlistId={playlistId}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {isLoading && <p>Saving changes...</p>}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TrackList;