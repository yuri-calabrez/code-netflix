<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $default = parent::toArray($request);
        $newFields = [
            'categories' => CategoryResource::collection($this->categories),
            'genres' => GenreResource::collection($this->genres),
            'cast_members' => CastMemberResource::collection($this->castMembers),
            'video_file' => $this->video_file_url,
            'trailer_file' => $this->trailer_file_url,
            'thumb_file' => $this->thumb_file_url,
            'banner_file' => $this->banner_file_url
        ];
        return array_merge($default, $newFields);
    }
}
