<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'created_by', 'title', 'series', 'week_number',
        'age_group', 'is_published', 'published_at',
    ];
    protected $casts = ['is_published' => 'boolean', 'published_at' => 'datetime'];

    public function creator()         { return $this->belongsTo(User::class, 'created_by'); }
    public function content()         { return $this->hasOne(LessonContent::class); }
    public function activities()      { return $this->hasMany(Activity::class); }
    public function lessonProgresses(){ return $this->hasMany(LessonProgress::class); }
}