<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ChildProfile extends Model
{
    protected $fillable = ['user_id', 'name', 'age', 'grade', 'avatar_color'];

    // ── Relationships ──────────────────
    public function user()                  { return $this->belongsTo(User::class); }
    public function lessonProgresses()      { return $this->hasMany(LessonProgress::class); }
    public function activitySubmissions()   { return $this->hasMany(ActivitySubmission::class); }
    public function verseCompletions()      { return $this->hasMany(VerseCompletion::class); }
    public function badges()               { return $this->belongsToMany(Badge::class, 'child_badges')
                                                ->withPivot('awarded_at')->withTimestamps(); }

    // ── Helper: map age to group ──────
    public function ageGroup(): string
    {
        return match(true) {
            $this->age <= 5  => 'nursery',
            $this->age <= 10 => 'kids',
            default           => 'youth',
        };
    }
}