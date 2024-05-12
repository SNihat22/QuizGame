import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

interface LeaderBoardResult {
  username: string;
  gamesPlayed: number;
  totalScores: number;
}
@Component({
  selector: 'app-leaderboards',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './leaderboards.component.html',
  styleUrl: './leaderboards.component.css'
})
export class LeaderboardsComponent implements OnInit {

  http = inject(HttpClient);
  leaderBoardResults: Array<LeaderBoardResult> = [];

  ngOnInit() {
    this.http.get<Array<LeaderBoardResult>>('user/getLeaderboard')
      .subscribe(res => {
        console.log(res);
        this.leaderBoardResults = res;
      })
  }

  protected readonly isNaN = isNaN;
}
